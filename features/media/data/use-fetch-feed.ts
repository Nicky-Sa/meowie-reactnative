import { useCallback, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchWithRepeat } from "@/features/common/data/fetch-with-repeat";
import { useQueryInfiniteConfigured } from "@/features/common/data/query/hooks";
import { SuccessResponse } from "@/features/common/data/transformers";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { FeedResponse } from "@/features/media/data/dto/feed.dto";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/utils/deduplicate";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Args = {
  mediaType: MediaType;
};

type FeedBatch = SuccessResponse<FeedResponse>;

const PREPARING_POLL_INTERVAL_MS = 2000;
const PREPARING_MAX_POLLS = 10;

const getNextBatch = (lastBatch: FeedBatch, batches: FeedBatch[]) => {
  const titleIds = lastBatch.data.results;
  if (titleIds.length === 0) return undefined;

  const earlierTitleIds = batches
    .slice(0, -1)
    .flatMap((batch) => batch.data.results);
  if (titleIds.every((id) => earlierTitleIds.includes(id))) return undefined;

  return batches.length;
};

export const useFetchFeed = ({ mediaType }: Args) => {
  const queryClient = useQueryClient();
  const { data: currentUser, isPending: isCheckingUser } = useCurrentUser();
  const { discovery } = useAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInProgress = useRef(false);

  const url = `/feed/${mediaType}`;
  const userId = currentUser?.user?.id ?? null;
  const queryKey = useMemo(() => [url, userId], [url, userId]);

  const {
    data: response,
    isLoading,
    hasNextPage,
    ...query
  } = useQueryInfiniteConfigured<FeedResponse>(queryKey, url, {
    queryFn: ({ signal }) =>
      fetchWithRepeat<FeedResponse>(
        url,
        {
          isReady: ({ status }) => status === "ready",
          intervalMs: PREPARING_POLL_INTERVAL_MS,
          maxRepeats: PREPARING_MAX_POLLS,
          timeoutErrorMessage:
            "Your feed is taking a while to prepare. Please try again.",
        },
        { signal },
      ),
    getNextPageParam: getNextBatch,
    enabled: !isCheckingUser,
    // Each GET consumes new titles. Automatic refetching would replace every loaded batch.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  });

  const feedItems = useMemo<MediaListItemData[]>(
    () =>
      deduplicate(
        // deduplicate -> in case the backend starts serving "already-served" titles because we ran out of them
        (response ?? [])
          .flatMap((batch) => batch.data.results)
          .map((id) => ({ id, mediaType })),
        (item) => `${item.mediaType}-${item.id}`,
      ),
    [response, mediaType],
  );

  const requestNewBatch = useCallback(async () => {
    if (refreshInProgress.current) return;

    refreshInProgress.current = true;
    setIsRefreshing(true);
    try {
      await queryClient.resetQueries({ queryKey, exact: true });
    } finally {
      refreshInProgress.current = false;
      setIsRefreshing(false);
    }
  }, [queryClient, queryKey]);

  const onRefresh = useCallback(() => {
    if (refreshInProgress.current) return;

    discovery.trackFeedRefreshed({ mediaType });
    return requestNewBatch();
  }, [discovery, mediaType, requestNewBatch]);

  return {
    ...query,
    data: feedItems,
    hasNextPage: !isRefreshing && hasNextPage,
    isLoading: isCheckingUser || isLoading,
    refetch: requestNewBatch,
    onRefresh,
    isRefreshing,
  };
};
