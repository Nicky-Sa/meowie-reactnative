import { ErrorState } from "@/features/general/error-state";
import { useListRef } from "@/features/common/hooks/list/useListRef";
import { useFetchMore } from "@/features/common/hooks/list/useFetchMore";
import Animated, {
  ScrollHandlerProcessed,
  SharedValue,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MovieDetailsSkeleton } from "@/features/media/components/details/media-details-skeleton";
import { MediaListItem } from "@/features/media/components/list/media-list-item";
import { MediaListItemData } from "@/features/media/components/list/types";

type Props = {
  data: MediaListItemData[];
  dataLength: number;
  isLoading: boolean;
  isValidating: boolean;
  size: number;
  setSize: (size: number) => void;
  totalPages: number;
  error: Error | undefined;
  mutate: () => void;
  initialScrollIndex?: number;
  scrollToTopIfChanges?: unknown;
  currentIndex: number;
  scrollY: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed;
  isActive?: boolean;
};

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MediaListItemData>,
);

export const MediaList = ({
  data,
  isLoading,
  isValidating,
  size,
  setSize,
  totalPages,
  error,
  mutate,
  initialScrollIndex,
  scrollToTopIfChanges,
  currentIndex,
  scrollY,
  scrollHandler,
  isActive = true,
}: Props) => {
  const listRef = useListRef<MediaListItemData>(scrollToTopIfChanges);

  const { onEndReached } = useFetchMore({
    size,
    setSize,
    isLoading,
    isValidating,
    totalPages,
  });

  const isInitialLoad = isLoading && (!data || data.length === 0);

  // Only use initialScrollIndex if we are NOT loading
  // AND the index actually exists in the current data array.
  const safeInitialIndex =
    !isInitialLoad &&
    initialScrollIndex !== undefined &&
    initialScrollIndex < (data?.length ?? 0)
      ? initialScrollIndex
      : undefined;

  return (
    <AnimatedFlashList
      data={data}
      ref={listRef}
      keyExtractor={(item, index) => `info-${item.mediaType}-${item.id}`}
      initialScrollIndex={safeInitialIndex}
      renderItem={({ item, index }) => (
        <MediaListItem
          key={`${item.mediaType}-${item.id}`}
          item={item}
          inScreen={index === currentIndex && isActive}
          index={index}
          scrollY={scrollY}
        />
      )}
      pagingEnabled
      // Animation Handler
      onScroll={scrollHandler}
      // Pagination Handlers
      onEndReached={onEndReached}
      onEndReachedThreshold={2} // Triggers when 2 screen height away from bottom: (Page_Size - Expect_Trigger_Position) / On_Screen_Visible_Items
      showsVerticalScrollIndicator={false}
      contentContainerClassName={"grow px-4"}
      ListEmptyComponent={
        error ? (
          <ErrorState tryAgain={mutate} error={error} />
        ) : isInitialLoad ? (
          <MovieDetailsSkeleton />
        ) : null
      }
    />
  );
};
