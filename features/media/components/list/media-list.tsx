import { View } from "react-native";
import { ErrorState } from "@/features/general/error-state";
import { useListRef } from "@/features/common/hooks/list/useListRef";
import { useFetchMore } from "@/features/common/hooks/list/useFetchMore";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import Animated, {
  ScrollHandlerProcessed,
  SharedValue,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MovieDetailsSkeleton } from "@/features/media/components/details/media-details-skeleton";
import { MediaListItem } from "@/features/media/components/list/media-list-item";
import { MediaListItemData } from "@/features/media/components/list/types";
import { EmptyState } from "@/features/general/empty-state";
import { ReactElement, useCallback, memo } from "react";

type Props = {
  data: MediaListItemData[];
  dataLength: number;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  refetch: () => void;
  initialScrollIndex?: number;
  scrollToTopIfChanges?: unknown;
  currentIndex: number;
  scrollY: SharedValue<number>;
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
    initialScrollIndex,
    scrollToTopIfChanges,
    currentIndex,
    scrollY,
    scrollHandler,
    ListEmptyComponent = <EmptyState />,
    isActive = true,
  }: Props) => {
    const listRef = useListRef<MediaListItemData>(scrollToTopIfChanges);

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
      (!data || data.length <= initialScrollIndex) &&
      !isDataEmpty;

    const isInitialLoad =
      isWaitingForInitialData || (isLoading && (!data || data.length === 0));

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
        key={
          initialScrollIndex !== undefined
            ? isWaitingForInitialData
              ? "loading"
              : "ready"
            : "static"
        }
        data={data}
        ref={listRef}
        keyExtractor={({ mediaType, id }) => `${mediaType}-${id}`}
        initialScrollIndex={
          isWaitingForInitialData ? undefined : initialScrollIndex
        }
        renderItem={renderItem}
        pagingEnabled
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
              <MovieDetailsSkeleton />
            ) : (
              ListEmptyComponent
            )}
          </View>
        }
      />
    );
  },
);

MediaList.displayName = "MediaList";
