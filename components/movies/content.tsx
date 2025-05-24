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
import {
  useContentScreenSize,
  useRenderScrollIndicator,
} from "@/components/movies/hooks";
import { ScrollIndicator } from "@/components/movies/elements/scroll-indicator";
import { FlashList } from "@shopify/flash-list";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = () => {
  const { height } = useContentScreenSize();
  const [filtersQueryParams] = useAtom(filtersQueryParamsAtom);

  const { data, dataLength, setSize, isLoading, error, mutate } =
    useFetchMoviesIds({
      queryParams: filtersQueryParams,
    });

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0); // Track scroll position
  const shouldRenderScrollIndicator = useRenderScrollIndicator(currentIndex);

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
        layoutMeasurement.height * (dataLength - 1)
      ) {
        runOnJS(setSize)(Math.floor((currentIndex + 2) / dataLength) + 1);
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
        {isLoading ? (
          <MoviesSkeleton />
        ) : dataLength > 0 ? (
          <>
            <AnimatedFlashList
              data={data}
              keyExtractor={(id, index) => `movie-${id}-${index}`}
              renderItem={({ item: movieId, index }) => (
                <DetailsContainer
                  key={index}
                  movieId={movieId}
                  shouldPlay={index === currentIndex}
                  index={index}
                  scrollY={scrollY}
                />
              )}
              pagingEnabled
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={height}
            />
            {shouldRenderScrollIndicator && (
              <ScrollIndicator shouldShow={currentIndex <= 0} />
            )}
          </>
        ) : (
          <MoviesEmptyState />
        )}
      </MainBg>
    </>
  );
};
