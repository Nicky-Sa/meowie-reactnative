import { scheduleOnRN } from "react-native-worklets";
import { useState } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type Args = {
  itemHeight: number;
  dataLength: number;
  size: number;
  setSize: (size: number) => void;
  totalPages: number;
};

export const useScrollHandler = ({
  itemHeight,
  dataLength,
  size,
  setSize,
  totalPages,
}: Args) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0); // Track scroll position

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const heighFromTop = contentOffset.y;
      const threshold = itemHeight * (dataLength - 2); // 2 items earlier -> load more
      const progress = heighFromTop / layoutMeasurement.height;
      scrollY.value = heighFromTop; // Update shared value

      scheduleOnRN(setCurrentIndex, Math.round(progress));

      // Trigger load more when near the bottom
      // note on size <= totalPages: it will allow one size above totalPages,
      // to trigger no more load logic in useFetchMoviesIds
      if (heighFromTop >= threshold && size <= totalPages) {
        scheduleOnRN(setSize, size + 1);
      }
    },
  });

  // Reset scroll position when data is loaded
  const onLoad = () => {
    scrollY.value = 0;
  };

  return { scrollHandler, scrollY, currentIndex, onLoad };
};
