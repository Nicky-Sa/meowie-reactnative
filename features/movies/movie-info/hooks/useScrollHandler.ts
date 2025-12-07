import { scheduleOnRN } from "react-native-worklets";
import { useState } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type Args = {
  dataLength: number;
  setSize: (size: number) => void;
};

export const useScrollHandler = ({ dataLength, setSize }: Args) => {
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

  // Reset scroll position when data is loaded
  const onLoad = () => {
    scrollY.value = 0;
  };

  return { scrollHandler, scrollY, currentIndex, onLoad };
};
