import { scheduleOnRN } from "react-native-worklets";
import { useState } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const useScrollHandler = ({
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
