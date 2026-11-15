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
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";
import { useShareTasteCard } from "@/features/taste/share-taste-card/use-share-taste-card";

type Args = {
  mediaType: MediaType;
};

type FeedDelivery = SuccessResponse<FeedResponse>;

const PREPARING_POLL_INTERVAL_MS = 2000;
const PREPARING_MAX_POLLS = 90;

const getNextDelivery = (
  lastDelivery: FeedDelivery,
  deliveries: FeedDelivery[],
) => {
  const titleIds = lastDelivery.data.results;
  if (titleIds.length === 0) return undefined;

  return deliveries.length;
};

export const useFetchFeed = ({ mediaType }: Args) => {
  const { data: currentUser, isPending: isCheckingUser } = useCurrentUser();
  const { media } = useAnalytics();
  const { withShareTasteCard } = useShareTasteCard();

  const url = `/feed/${mediaType}`;
  const userId = currentUser?.user?.id ?? null;
  const queryKey = useMemo(() => [url, userId], [url, userId]);
  const { refresh: resetAndRequestNewDelivery, isRefreshing } =
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
    getNextPageParam: getNextDelivery,
    enabled: !isCheckingUser,
    // Each GET consumes new titles. Automatic refetching would replace every loaded delivery.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  });

  const feedItems = useMemo<MediaListItemData[]>(
    () =>
      withShareTasteCard(
        (response ?? []).flatMap((delivery, deliveryIndex) =>
          delivery.data.results.map((id) => ({
            id,
            mediaType,
            deliveryIndex,
          })),
        ),
        mediaType,
      ),
    [response, mediaType, withShareTasteCard],
  );

  const onRefresh = useCallback(() => {
    if (isRefreshing) return;

    media.trackFeedRefreshed({ mediaType });
    return resetAndRequestNewDelivery();
  }, [media, isRefreshing, mediaType, resetAndRequestNewDelivery]);

  return {
    ...query,
    data: feedItems,
    hasNextPage: !isRefreshing && !query.isError && hasNextPage,
    isLoading: isCheckingUser || isLoading,
    refetch: query.isFetchNextPageError
      ? query.fetchNextPage
      : resetAndRequestNewDelivery,
    onRefresh,
    isRefreshing,
  };
};
