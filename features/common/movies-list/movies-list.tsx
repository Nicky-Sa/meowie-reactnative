import { ErrorState } from "@/features/general/error-state";
import { useListRef } from "@/features/browse/hooks/list/useListRef";
import { useScrollHandler } from "@/features/browse/hooks/list/useScrollHandler";
import { useFetchMore } from "@/features/browse/hooks/list/useFetchMore";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { MovieDetailsSkeleton } from "@/features/common/movies-list/details/movie-details-skeleton";
import { MoviesListItem } from "@/features/common/movies-list/movies-list-item";

type Props = {
  data: number[];
  dataLength: number;
  isLoading: boolean;
  isValidating: boolean;
  size: number;
  setSize: (size: number) => void;
  totalPages: number;
  error: Error | undefined;
  mutate: () => void;
  initialScrollIndex?: number;
};

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const MoviesList = ({
  data,
  isLoading,
  isValidating,
  size,
  setSize,
  totalPages,
  error,
  mutate,
  initialScrollIndex,
}: Props) => {
  const listRef = useListRef();
  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler();

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
      keyExtractor={(id) => `movie-${id}-info`}
      initialScrollIndex={safeInitialIndex}
      renderItem={({ item: movieId, index }) => (
        <MoviesListItem
          key={movieId}
          movieId={movieId}
          shouldPlay={index === currentIndex}
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
      onLoad={onLoad}
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
