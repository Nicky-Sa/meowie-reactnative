import { useCallback, useMemo } from "react";
import { fetchWithRepeat } from "@/features/common/data/fetch-with-repeat";
import {
  useQueryInfiniteConfigured,
  useRefreshQuery,
} from "@/features/common/data/query/hooks";
import { SuccessResponse } from "@/features/common/data/transformers";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MediaListItemData } from "@/features/media/components/list/types";
import { FeedResponse } from "@/features/media/data/dto/feed.dto";
import { MediaType } from "@/features/common/data/models/media-type";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useShareTasteCard } from "@/features/taste/share-taste-card/use-share-taste-card";

type Args = {
  mediaType: MediaType;
};

type FeedBatch = SuccessResponse<FeedResponse>;

const PREPARING_POLL_INTERVAL_MS = 2000;
const PREPARING_MAX_POLLS = 90;

const getNextBatch = (lastBatch: FeedBatch, batches: FeedBatch[]) => {
  const titleIds = lastBatch.data.results;
  if (titleIds.length === 0) return undefined;

  return batches.length;
};

export const useFetchFeed = ({ mediaType }: Args) => {
  const { data: currentUser, isPending: isCheckingUser } = useCurrentUser();
  const { discovery } = useAnalytics();
  const { withShareTasteCard } = useShareTasteCard();

  const url = `/feed/${mediaType}`;
  const userId = currentUser?.user?.id ?? null;
  const queryKey = useMemo(() => [url, userId], [url, userId]);
  const { refresh: resetAndRequestNewBatch, isRefreshing } =
    useRefreshQuery(queryKey);

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
      withShareTasteCard(
        (response ?? []).flatMap((batch, batchIndex) =>
          batch.data.results.map((id) => ({
            id,
            mediaType,
            batchIndex,
          })),
        ),
        mediaType,
      ),
    [response, mediaType, withShareTasteCard],
  );

  const onRefresh = useCallback(() => {
    if (isRefreshing) return;

    discovery.trackFeedRefreshed({ mediaType });
    return resetAndRequestNewBatch();
  }, [discovery, isRefreshing, mediaType, resetAndRequestNewBatch]);

  return {
    ...query,
    data: feedItems,
    hasNextPage: !isRefreshing && !query.isError && hasNextPage,
    isLoading: isCheckingUser || isLoading,
    refetch: query.isFetchNextPageError
      ? query.fetchNextPage
      : resetAndRequestNewBatch,
    onRefresh,
    isRefreshing,
  };
};
