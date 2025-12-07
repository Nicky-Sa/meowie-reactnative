import Animated from "react-native-reanimated";
import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { MainScreen } from "@/features/common/layout/main-screen";
import {
  MovieDetails,
  MovieDetailsSkeleton,
} from "@/features/movies/elements/details";
import { Header } from "@/features/general/layout/header";
import { ErrorState } from "@/features/general/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { FlashList } from "@shopify/flash-list";
import { useScrollHandler } from "@/features/movies/movie-info/hooks/useScrollHandler";
import { useListRef } from "@/features/movies/movie-info/hooks/useListRef";
import { SortHeaderButton } from "@/features/sort/header-button";
import { useFetchMore } from "@/features/movies/movie-info/hooks/useFetchMore";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = () => {
  const listRef = useListRef();

  const {
    data,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    error,
    mutate,
    key,
  } = useFetchMoviesIds();

  // Simplified handler only controls animation and current index
  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler();

  const { onEndReached } = useFetchMore({
    size,
    setSize,
    isLoading,
    totalPages,
  });

  return (
    <MainScreen>
      <Header headerButton={<SortHeaderButton />} />
      {isLoading && dataLength === 0 ? (
        // Non-scrollable skeleton for initial load (not pagination load)
        <MovieDetailsSkeleton />
      ) : error ? (
        <ErrorState tryAgain={mutate} error={error} />
      ) : dataLength > 0 ? (
        <AnimatedFlashList
          ref={listRef}
          key={key} // to remount the list when filters or sort change
          data={data}
          keyExtractor={(id, index) => `movie-${id}-${index}`}
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
          onEndReachedThreshold={2} // Triggers when 2 screen height away from bottom
          onLoad={onLoad}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MoviesEmptyState />
      )}
    </MainScreen>
  );
};
