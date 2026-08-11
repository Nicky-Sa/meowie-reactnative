import { useCallback, useMemo, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/features/common/data/paginated-response";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";
// Taste is hidden until the backend is refreshed.
// import { useVibeCard } from "@/features/taste/vibe-card/use-vibe-card";

type Args = {
  mediaType: MediaType;
};

/**
 * Home feed. Always hits `/feed/<media>`; the backend decides guest vs
 * personalized. Guests append `audience=guest` so CloudFront keeps the
 * cacheable guest feed on its own key — its cache key includes query strings
 * but not Authorization.
 */
export const useFetchFeed = ({ mediaType }: Args) => {
  const { data: currentUser, isPending: isCheckingUser } = useCurrentUser();
  const isLoggedIn = !!currentUser?.user;
  // const { withVibeCard } = useVibeCard();

  // Stays on for the whole pull-to-refresh, so a request that gets cancelled or
  // fails doesn't leave the flag stuck on for some later, unrelated fetch.
  const wantsRefresh = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const baseUrl = `/feed/${mediaType}`;

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    ...rest
  } = useQueryPaginatedConfigured<PaginatedResponse<number>>(
    [baseUrl, isLoggedIn],
    (pageParam: number) => {
      const params = [`page=${pageParam + 1}`];
      // Only page 1 asks the backend to rebuild the pool.
      if (wantsRefresh.current && pageParam === 0) params.push("refresh=true");
      if (!isLoggedIn) params.push("audience=guest");
      return `${baseUrl}?${params.join("&")}`;
    },
    {
      // Starting before `/user/current` settles would fetch the guest feed for
      // everyone, and the cached guest response usually wins that race.
      enabled: !isCheckingUser,
      placeholderData: keepPreviousData,
      // The feed is deliberately shuffled per user. Refetching every page on
      // app focus would reshuffle the list someone is halfway through.
      refetchOnWindowFocus: false,
    },
  );

  const feedItems = useMemo(() => {
    const titles: MediaListItemData[] = deduplicate(
      (response ?? [])
        .flatMap((page) => page.data.results)
        .map((id) => ({
          id,
          mediaType,
        })),
      (item) => `${item.mediaType}-${item.id}`,
    );
    return titles;
    // return withVibeCard(titles, mediaType);
  }, [response, mediaType]);

  const onRefresh = useCallback(async () => {
    wantsRefresh.current = true;
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      wantsRefresh.current = false;
      setIsRefreshing(false);
    }
  }, [refetch]);

  return {
    data: feedItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // The query sits disabled while the user check runs, which reads as "idle"
    // rather than "loading" — the screen should still show the spinner.
    isLoading: isCheckingUser || isLoading,
    refetch,
    onRefresh,
    isRefreshing,
    ...rest,
  };
};
