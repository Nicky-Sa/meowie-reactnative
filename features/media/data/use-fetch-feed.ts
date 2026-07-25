import { useCallback, useMemo, useRef } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/features/common/data/paginated-response";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";
import { useVibeCard } from "@/features/taste/vibe-card/use-vibe-card";

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
  const { withVibeCard } = useVibeCard();

  // Only page 1 of a pull-to-refresh carries the flag, and only once: a later
  // refetch on app focus must not rebuild the pool under the user.
  const wantsRefresh = useRef(false);

  const baseUrl = `/feed/${mediaType}`;

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isPlaceholderData,
    isLoading,
    refetch,
    ...rest
  } = useQueryPaginatedConfigured<PaginatedResponse<number>>(
    [baseUrl, isLoggedIn],
    (pageParam: number) => {
      const refresh = wantsRefresh.current && pageParam === 0;
      if (refresh) wantsRefresh.current = false;

      const params = [`page=${pageParam + 1}`];
      if (refresh) params.push("refresh=true");
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
    return withVibeCard(titles, mediaType);
  }, [response, mediaType, withVibeCard]);

  const onRefresh = useCallback(() => {
    wantsRefresh.current = true;
    void refetch();
  }, [refetch]);

  const isRefreshing = isFetching && isPlaceholderData;

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
