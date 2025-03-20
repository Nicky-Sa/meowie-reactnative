import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useFetchMoviesIds } from "@/hooks/data/useFetchMoviesIds";
import { MainBg } from "@/components/movies/layout/main-bg";
import { DetailsContainer } from "@/components/movies/details/container";
import { Header } from "@/components/movies/layout/header";
import { SplashScreen } from "@/components/movies/layout/splash-screen";

const TMDB_DATA_LIMIT = 20;

export const Content = () => {
  const { data, setSize, isLoading } = useFetchMoviesIds();

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

  return (
    <>
      <SplashScreen isLoading={isLoading} />
      <MainBg>
        <Header />
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
              shouldFetch={index === currentIndex || index === currentIndex + 1}
              index={index}
              scrollY={scrollY}
            />
          ))}
        </Animated.ScrollView>
      </MainBg>
    </>
  );
};
