import { ScrollViewProps, View } from "react-native";
import { ErrorState } from "@/features/general/error-state";
import { useFetchMore } from "@/features/common/hooks/list/use-fetch-more";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import Animated, {
  ScrollHandlerProcessed,
  SharedValue,
} from "react-native-reanimated";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { MediaInfoSkeleton } from "@/features/media/components/info/media-info-skeleton";
import { MediaListItem } from "@/features/media/components/list/media-list-item";
import { MediaListItemData } from "@/features/media/components/list/types";
import { EmptyState } from "@/features/general/empty-state";
import { Loading } from "@/features/common/ui/loading";
import { ReactElement, RefObject, useCallback, memo } from "react";

type Props = {
  data: MediaListItemData[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  refetch: () => void;
  listRef: RefObject<FlashListRef<MediaListItemData> | null>;
  refreshControl?: ScrollViewProps["refreshControl"];
  initialScrollIndex?: number;
  currentIndex: number;
  scrollY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  scrollHandler: ScrollHandlerProcessed;
  ListEmptyComponent?: ReactElement;
  isActive?: boolean;
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
    listRef,
    refreshControl,
    initialScrollIndex,
    currentIndex,
    scrollY,
    isDragging,
    scrollHandler,
    ListEmptyComponent = <EmptyState />,
    isActive = true,
  }: Props) => {
    const contentStyle = useMainScreenContentStyle();
    const { onEndReached } = useFetchMore({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
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
      <AnimatedFlashList
        key={isWaitingForInitialData ? "loading" : "ready"}
        data={data}
        ref={listRef}
        keyExtractor={({ mediaType, id, batchIndex }) =>
          `${mediaType}-${id}-${batchIndex ?? ""}`
        }
        initialScrollIndex={
          isWaitingForInitialData ? undefined : initialScrollIndex
        }
        renderItem={renderItem}
        pagingEnabled
        refreshControl={refreshControl}
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
        ListFooterComponent={
          !isDataEmpty && error ? (
            <View
              style={contentStyle}
              className={"flex items-center justify-center"}
            >
              {isFetchingNextPage ? (
                <Loading />
              ) : (
                <ErrorState tryAgain={refetch} error={error} />
              )}
            </View>
          ) : null
        }
      />
    );
  },
);

MediaList.displayName = "MediaList";
