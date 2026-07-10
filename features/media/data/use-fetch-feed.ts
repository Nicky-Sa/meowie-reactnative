import { useState, useCallback } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/features/common/data/paginated-response";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";

type Args = {
  mediaType: MediaType;
};

/**
 * Home feed. Always hits `/feed/<media>`; the backend decides guest vs
 * personalized. `isLoggedIn` is in the query key so the feed refetches when
 * auth changes. Pull-to-refresh bumps `refreshCount`, restarting at page 1 with
 * `refresh=true` so the backend rebuilds a fresh pool.
 *
 * Guests append `audience=guest`. CloudFront's cache key includes query strings
 * but not Authorization, so this keeps the cacheable guest feed on a separate
 * key from logged-in requests (which are `private, no-store`).
 */
export const useFetchFeed = ({ mediaType }: Args) => {
  const { data: currentUser } = useCurrentUser();
  const isLoggedIn = !!currentUser?.user;

  const [refreshCount, setRefreshCount] = useState(0);
  const baseUrl = `/feed/${mediaType}`;

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isPlaceholderData,
    ...rest
  } = useQueryPaginatedConfigured<PaginatedResponse<number>>(
    [baseUrl, isLoggedIn, refreshCount],
    (pageParam: number) => {
      const refresh = refreshCount > 0 && pageParam === 0;
      const params = [`page=${pageParam + 1}`];
      if (refresh) params.push("refresh=true");
      if (!isLoggedIn) params.push("audience=guest");
      return `${baseUrl}?${params.join("&")}`;
    },
    { placeholderData: keepPreviousData },
  );

  const flattenedData: MediaListItemData[] = deduplicate(
    (Array.isArray(response) ? response : [])
      .flatMap((page) => page.data.results)
      .map((id) => ({ id, mediaType })),
    (item) => `${item.mediaType}-${item.id}`,
  );

  const onRefresh = useCallback(
    () => setRefreshCount((count) => count + 1),
    [],
  );
  const isRefreshing = isFetching && isPlaceholderData;

  return {
    data: flattenedData,
    dataLength: flattenedData.length,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onRefresh,
    isRefreshing,
    ...rest,
  };
};
