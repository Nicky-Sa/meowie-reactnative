import { ErrorState } from "@/features/general/error-state";
import { MovieDetails } from "@/features/movies/elements/details";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useListRef } from "@/features/movies/hooks/useListRef";
import { useScrollHandler } from "@/features/movies/hooks/useScrollHandler";
import { useFetchMore } from "@/features/movies/hooks/useFetchMore";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { useQueryKey } from "@/features/movies/hooks/useQueryKey";

type Props = {
  data: number[];
  dataLength: number;
  isLoading: boolean;
  size: number;
  setSize: (size: number) => void;
  totalPages: number;
  error: Error | undefined;
  mutate: () => void;
  initialScrollIndex?: number;
};

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

const skeletonData = [-1];

export const MoviesList = ({
  data,
  dataLength,
  isLoading,
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
    totalPages,
  });

  const queryKey = useQueryKey();

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
    <>
      {error ? (
        <ErrorState tryAgain={mutate} error={error} />
      ) : isLoading || dataLength > 0 ? (
        <AnimatedFlashList
          data={isInitialLoad ? skeletonData : data}
          ref={listRef}
          key={queryKey} // forcing the list to recreate when the key changes
          keyExtractor={(id) => `movie-${id}-info`}
          initialScrollIndex={safeInitialIndex}
          renderItem={({ item: movieId, index }) => (
            <MovieDetails
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
        />
      ) : (
        <MoviesEmptyState />
      )}
    </>
  );
};
