import { useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { MainBg } from "@/features/movies/layout/main-bg";
import { DetailsContainer } from "@/features/movies/elements/container";
import { Header } from "@/features/movies/layout/header";
import { useAtom } from "jotai";
import { filtersQueryParamsAtom } from "@/atoms";
import { MoviesSkeleton } from "@/features/movies/elements/skeleton";
import { MoviesErrorState } from "@/features/movies/elements/error-state";
import { MoviesEmptyState } from "@/features/movies/elements/empty-state";
import { useRenderScrollIndicator } from "@/features/movies/hooks/useRenderScrollIndicator";
import { ScrollIndicator } from "@/features/movies/elements/scroll-indicator";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { scheduleOnRN } from "react-native-worklets";
import { useScrollToTop } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "@/features/general/navbar/types";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<number>);

export const Content = () => {
  const [filtersQueryParams] = useAtom(filtersQueryParamsAtom);
  const listRef = useListRef();

  const { data, dataLength, setSize, isLoading, error, mutate } =
    useFetchMoviesIds({
      queryParams: filtersQueryParams,
    });

  const { scrollHandler, scrollY, currentIndex } = useScrollHandler({
    dataLength,
    setSize,
  });
  const shouldRenderScrollIndicator = useRenderScrollIndicator(currentIndex);

  return (
    <MainBg>
      {error ? (
        <MoviesErrorState tryAgain={mutate} error={error} />
      ) : (
        <>
          <Header />
          {isLoading ? (
            <MoviesSkeleton />
          ) : dataLength > 0 ? (
            <>
              <AnimatedFlashList
                ref={listRef}
                key={JSON.stringify(filtersQueryParams)}
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
              />
              {shouldRenderScrollIndicator && (
                <ScrollIndicator shouldShow={currentIndex <= 0} />
              )}
            </>
          ) : (
            <MoviesEmptyState />
          )}
        </>
      )}
    </MainBg>
  );
};

const useListRef = () => {
  const listRef = useRef<FlashListRef<number>>(null);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  useScrollToTop(listRef);
  useEffect(() => {
    return navigation.addListener("tabPress", () => {
      // Only scroll to top if already focused
      const isFocused = navigation.isFocused();
      if (isFocused) {
        listRef.current?.scrollToTop();
      }
    });
  }, [navigation]);

  return listRef;
};

const useScrollHandler = ({
  dataLength,
  setSize,
}: {
  dataLength: number;
  setSize: (size: number) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0); // Track scroll position

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const progress = contentOffset.y / layoutMeasurement.height;
      scrollY.value = contentOffset.y; // Update shared value
      const activeIndex = Math.round(progress);

      scheduleOnRN(setCurrentIndex, activeIndex);

      // Trigger load more when near the bottom
      if (
        contentOffset.y + layoutMeasurement.height >=
        layoutMeasurement.height * (dataLength - 1)
      ) {
        scheduleOnRN(setSize, Math.floor((currentIndex + 2) / dataLength) + 1); // in case dataLength was smaller than 20
      }
    },
  });
  return { scrollHandler, scrollY, currentIndex };
};
