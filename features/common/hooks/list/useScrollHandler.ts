import { scheduleOnRN } from "react-native-worklets";
import { useState, useCallback } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const useScrollHandler = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0);
  const indexTracker = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const heightFromTop = contentOffset.y;
      scrollY.value = heightFromTop;

      const progress = heightFromTop / layoutMeasurement.height;
      const newCurrentIndex = Math.round(progress);

      // Only update if the index has changed, not on every scroll event
      if (indexTracker.value !== newCurrentIndex) {
        indexTracker.value = newCurrentIndex;
        scheduleOnRN(setCurrentIndex, newCurrentIndex);
      }
    },
  });

  // Reset scroll position when data resets
  const resetScroll = useCallback(() => {
    scrollY.value = 0;
    indexTracker.value = 0;
    setCurrentIndex(0);
  }, [scrollY, indexTracker]);

  return { scrollHandler, scrollY, currentIndex, resetScroll };
};
