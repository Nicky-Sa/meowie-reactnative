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
  const [color, setColor] = useState("#9CDFFF");

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      scrollY.value = contentOffset.y; // Update scroll position

      // Calculate the current index based on scroll progress
      const progress = contentOffset.y / layoutMeasurement.height;
      const activeIndex = Math.floor(progress); // Current index
      const fractionalIndex = progress - activeIndex; // Fractional part (0 to 1)

      // Update currentIndex dynamically
      if (fractionalIndex > 0.1) {
        runOnJS(setCurrentIndex)(activeIndex + 1); // Next index
      } else {
        runOnJS(setCurrentIndex)(activeIndex); // Current index
      }

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
              scrollY={scrollY}
              setColor={setColor}
              index={index}
              shouldPlay={index === currentIndex}
              shouldFetch={index === currentIndex || index === currentIndex + 1}
            />
          ))}
        </Animated.ScrollView>
      </GradientBg>
    </GestureHandlerRootView>
  );
}
