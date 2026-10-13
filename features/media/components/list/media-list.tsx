import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorState } from "@/features/general/error-state";
import { useListRef } from "@/features/common/hooks/list/use-list-ref";
import { useFetchMore } from "@/features/common/hooks/list/use-fetch-more";
import { usePullToRefresh } from "@/features/common/hooks/list/use-pull-to-refresh";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import Animated, {
  ScrollHandlerProcessed,
  SharedValue,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MediaInfoSkeleton } from "@/features/media/components/info/media-info-skeleton";
import { MediaListItem } from "@/features/media/components/list/media-list-item";
import { MediaListItemData } from "@/features/media/components/list/types";
import { EmptyState } from "@/features/general/empty-state";
import { Loading } from "@/features/common/ui/loading";
import { ReactElement, useCallback, memo } from "react";

type Props = {
  data: MediaListItemData[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  refetch: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  initialScrollIndex?: number;
  currentIndex: number;
  scrollY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollHandler: ScrollHandlerProcessed;
  ListEmptyComponent?: ReactElement;
  isActive?: boolean;
  resetScroll?: () => void;
};

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MediaListItemData>,
);

export const MediaList = memo(
  ({
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
    onRefresh,
    isRefreshing = false,
    initialScrollIndex,
    currentIndex,
    scrollY,
    isDragging,
    scrollHandler,
    ListEmptyComponent = <EmptyState />,
    isActive = true,
    resetScroll,
  }: Props) => {
    const listRef = useListRef<MediaListItemData>();

    const insets = useSafeAreaInsets();
    const contentStyle = useMainScreenContentStyle();
    const { onEndReached } = useFetchMore({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
    });

    const handleRefresh = useCallback(() => {
      if (isRefreshing) return;

      if (resetScroll) {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
        resetScroll();
      }
      onRefresh?.();
    }, [isRefreshing, listRef, resetScroll, onRefresh]);

    const { isReadyToRefresh } = usePullToRefresh({
      scrollY,
      isDragging,
      onRefresh: onRefresh ? handleRefresh : undefined,
      isRefreshing,
      isActive,
    });

    const isDataEmpty = data.length === 0;

    const isWaitingForInitialData =
      initialScrollIndex !== undefined &&
      data.length <= initialScrollIndex &&
      !isDataEmpty;

    const isInitialLoad = isWaitingForInitialData || (isLoading && isDataEmpty);

    const renderItem = useCallback(
      ({ item, index }: { item: MediaListItemData; index: number }) => (
        <MediaListItem
          item={item}
          inScreen={index === currentIndex && isActive}
          index={index}
          scrollY={scrollY}
        />
      ),
      [currentIndex, isActive, scrollY],
    );

    return (
      <>
        <AnimatedFlashList
          key={isWaitingForInitialData ? "loading" : "ready"}
          data={data}
          ref={listRef}
          keyExtractor={({ mediaType, id }) => `${mediaType}-${id}`}
          initialScrollIndex={
            isWaitingForInitialData ? undefined : initialScrollIndex
          }
          renderItem={renderItem}
          pagingEnabled
          refreshing={isRefreshing}
          // Animation Handler
          onScroll={scrollHandler}
          // Pagination Handlers
          onEndReached={onEndReached}
          onEndReachedThreshold={2} // Triggers when 2 screen height away from bottom: (Page_Size - Expect_Trigger_Position) / On_Screen_Visible_Items
          showsVerticalScrollIndicator={false}
          contentContainerClassName={"grow px-4"}
          ListEmptyComponent={
            <View
              style={contentStyle}
              className={"flex items-center justify-center"}
            >
              {error ? (
                <ErrorState tryAgain={refetch} error={error} />
              ) : isInitialLoad ? (
                <MediaInfoSkeleton />
              ) : (
                ListEmptyComponent
              )}
            </View>
          }
        />

        {(isReadyToRefresh || isRefreshing) && (
          <View
            pointerEvents={"none"}
            style={{ top: insets.top + 56 }}
            className={"absolute inset-x-0 z-20 items-center"}
          >
            <View className={"rounded-full bg-neutral-15-default/40 px-3 py-2"}>
              <Loading />
            </View>
          </View>
        )}
      </>
    );
  },
);

MediaList.displayName = "MediaList";
