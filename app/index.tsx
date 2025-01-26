import React, { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useFetchMoviesIdList } from "@/hooks/TMDB/useFetchMoviesIdList";
import { Details } from "@/components/videoDetails/Details";
import { GradientBg } from "@/components/ui/GradientBg";

const TMDB_DATA_LIMIT = 20;

export default function Movies() {
  const { data, setSize } = useFetchMoviesIdList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0); // Track scroll position
  const [color, setColor] = useState("#4287f5");

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const activeIndex = Math.floor(
        contentOffset.y / layoutMeasurement.height,
      );

      scrollY.value = contentOffset.y; // Update shared value
      runOnJS(setCurrentIndex)(activeIndex);

      // Trigger load more when near the bottom
      if (
        contentOffset.y + layoutMeasurement.height >=
        layoutMeasurement.height * (data.length - 1)
      ) {
        runOnJS(() =>
          setSize(Math.floor((currentIndex + 2) / TMDB_DATA_LIMIT) + 1),
        )();
      }
    },
  });

  return (
    <GestureHandlerRootView className={"flex-1"}>
      <GradientBg colors={[`${color}75`, "transparent"]}>
        <Animated.ScrollView
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
        >
          {data.map((id, index) => (
            <Details
              key={index}
              id={id}
              setColor={setColor}
              shouldPlay={index === currentIndex}
              shouldFetch={index === currentIndex || index === currentIndex + 1}
              index={index}
              scrollY={scrollY}
            />
          ))}
        </Animated.ScrollView>
      </GradientBg>
    </GestureHandlerRootView>
  );
}
