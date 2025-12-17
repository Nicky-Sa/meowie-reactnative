import { scheduleOnRN } from "react-native-worklets";
import { useState } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const useScrollHandler = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const heightFromTop = contentOffset.y;
      scrollY.value = heightFromTop;

      const progress = heightFromTop / layoutMeasurement.height;
      const newCurrentIndex = Math.round(progress);
      scheduleOnRN(setCurrentIndex, newCurrentIndex);
    },
  });

  // Reset scroll position when data resets
  const onLoad = () => {
    scrollY.value = 0;
  };

  return { scrollHandler, scrollY, currentIndex, onLoad };
};
