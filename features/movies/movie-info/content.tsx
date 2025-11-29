import Animated from "react-native-reanimated";
import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { MainScreen } from "@/features/common/layout/main-screen";
import {
  MovieDetails,
  MovieDetailsSkeleton,
} from "@/features/movies/elements/details";
import { Header } from "@/features/general/layout/header";
import { MoviesErrorState } from "@/features/movies/elements/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { FlashList } from "@shopify/flash-list";
import { useScrollHandler } from "@/features/movies/movie-info/hooks/useScrollHandler";
import { useListRef } from "@/features/movies/movie-info/hooks/useListRef";
import { SortHeaderButton } from "@/features/sort/header-button";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = () => {
  const listRef = useListRef();

  const { data, dataLength, setSize, isLoading, error, mutate, key } =
    useFetchMoviesIds();

  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler({
    dataLength,
    setSize,
  });

  return (
    <MainScreen>
      <Header headerButton={<SortHeaderButton />} />
      {error ? (
        <MoviesErrorState tryAgain={mutate} error={error} />
      ) : isLoading ? (
        <MovieDetailsSkeleton />
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
          onScroll={scrollHandler}
          onLoad={onLoad}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MoviesEmptyState />
      )}
    </MainScreen>
  );
};
