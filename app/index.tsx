import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useFetchMoviesIdList } from "@/hooks/TMDB/useFetchMoviesIdList";
import { Details } from "@/components/videoDetails/Details";
import { Stack } from "expo-router";

export default function Movies() {
  const { data, size, setSize } = useFetchMoviesIdList();
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadMoreScreens = useCallback(() => {
    setSize(size + 1);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const activeIndex = Math.floor(
        contentOffset.y / layoutMeasurement.height,
      );

      runOnJS(setCurrentIndex)(activeIndex);

      // Trigger load more when near the bottom
      if (
        contentOffset.y + layoutMeasurement.height >=
        layoutMeasurement.height * (data.length - 1)
      ) {
        runOnJS(loadMoreScreens)();
      }
    },
  });

  return (
    <GestureHandlerRootView className={"flex-1"}>
      <Animated.ScrollView
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        {data.map((id, index) => (
          <Details key={id} id={id} shouldPlay={index === currentIndex} />
        ))}
      </Animated.ScrollView>
    </GestureHandlerRootView>
  );
}
