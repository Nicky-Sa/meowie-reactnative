import { useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useFetchMoviesIds } from "@/hooks/data/useFetchMoviesIds";
import { MainBg } from "@/components/movies/layout/main-bg";
import { DetailsContainer } from "@/components/movies/elements/container";
import { Header } from "@/components/movies/layout/header";
import { useAtom } from "jotai";
import { filtersQueryParamsAtom } from "@/atoms";
import { MoviesSkeleton } from "@/components/movies/elements/skeleton";
import { MoviesErrorState } from "@/components/movies/elements/error-state";
import { MoviesEmptyState } from "@/components/movies/elements/empty-state";

const TMDB_DATA_LIMIT = 20;

export const Content = () => {
  const [filtersQueryParams] = useAtom(filtersQueryParamsAtom);

  const { data, setSize, isLoading, error, mutate } = useFetchMoviesIds({
    queryParams: filtersQueryParams,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0); // Track scroll position

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const progress = contentOffset.y / layoutMeasurement.height;
      scrollY.value = contentOffset.y; // Update shared value
      const activeIndex = Math.floor(progress);

      runOnJS(setCurrentIndex)(activeIndex);

      // Trigger load more when near the bottom
      if (
        contentOffset.y + layoutMeasurement.height >=
        layoutMeasurement.height * (data.length - 1)
      ) {
        runOnJS(setSize)(Math.floor((currentIndex + 2) / TMDB_DATA_LIMIT) + 1);
      }
    },
  });

  if (error) {
    return (
      <MainBg>
        <MoviesErrorState tryAgain={mutate} />
      </MainBg>
    );
  }

  return (
    <>
      <MainBg>
        <Header />
        {/*This loading happens after applying filters*/}
        {isLoading ? (
          <MoviesSkeleton />
        ) : data.length > 0 ? (
          <Animated.ScrollView
            pagingEnabled
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            showsVerticalScrollIndicator={false}
          >
            {data.map((id, index) => (
              <DetailsContainer
                key={index}
                id={id}
                shouldPlay={index === currentIndex}
                shouldFetch={
                  index === currentIndex || index === currentIndex + 1
                }
                index={index}
                scrollY={scrollY}
              />
            ))}
          </Animated.ScrollView>
        ) : (
          <MoviesEmptyState />
        )}
      </MainBg>
    </>
  );
};
