import Animated from "react-native-reanimated";
import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { MainScreen } from "@/features/common/layout/main-screen";
import {
  MovieDetails,
  MovieDetailsSkeleton,
} from "@/features/movies/elements/details";
import { Header } from "@/features/general/layout/header";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { MoviesErrorState } from "@/features/movies/elements/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { FlashList } from "@shopify/flash-list";
import { FiltersHeaderButton } from "@/features/filters/elements/header-button";
import { useScrollHandler } from "@/features/movies/movie-info/hooks/useScrollHandler";
import { useListRef } from "@/features/movies/movie-info/hooks/useListRef";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = () => {
  const [filters] = useAtom(filtersAtom);
  const listRef = useListRef();

  const { data, dataLength, setSize, isLoading, error, mutate } =
    useFetchMoviesIds();

  const { scrollHandler, scrollY, currentIndex } = useScrollHandler({
    dataLength,
    setSize,
  });

  return (
    <MainScreen>
      <Header headerButton={<FiltersHeaderButton />} />
      {error ? (
        <MoviesErrorState tryAgain={mutate} error={error} />
      ) : isLoading ? (
        <MovieDetailsSkeleton />
      ) : dataLength > 0 ? (
        <AnimatedFlashList
          ref={listRef}
          key={JSON.stringify(filters)}
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
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MoviesEmptyState />
      )}
    </MainScreen>
  );
};
