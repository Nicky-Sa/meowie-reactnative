import { ErrorState } from "@/features/general/error-state";
import { MovieDetails } from "@/features/movies/elements/details";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useListRef } from "@/features/movies/movies-info/hooks/useListRef";
import { useScrollHandler } from "@/features/movies/movies-info/hooks/useScrollHandler";
import { useFetchMore } from "@/features/movies/movies-info/hooks/useFetchMore";
import Animated from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";

type Props = {
  data: number[];
  dataLength: number;
  isLoading: boolean;
  size: number;
  setSize: (size: number) => void;
  totalPages: number;
  error: Error | undefined;
  mutate: () => void;
  queryKey?: string;
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
  queryKey,
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

  const isInitialLoad = isLoading && (!data || data.length === 0);

  return (
    <>
      {error ? (
        <ErrorState tryAgain={mutate} error={error} />
      ) : isLoading || dataLength > 0 ? (
        <AnimatedFlashList
          data={isInitialLoad ? skeletonData : data}
          ref={listRef}
          key={queryKey}
          keyExtractor={(id) => `movie-${id}-info`}
          initialScrollIndex={initialScrollIndex}
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
