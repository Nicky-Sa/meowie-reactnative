import { scheduleOnRN } from "react-native-worklets";
import { useState, useCallback } from "react";
import { ScrollEvent, useSharedValue } from "react-native-reanimated";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useScrollPosition } from "@/features/common/hooks/list/use-scroll-position";

type Args = {
  initialIndex?: number;
};

export const useScrollHandler = ({ initialIndex = 0 }: Args = {}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const indexTracker = useSharedValue(initialIndex);
  const { media } = useAnalytics();

  const changeCard = useCallback(
    (newIndex: number, previousIndex: number) => {
      setCurrentIndex(newIndex);
      media.trackMediaSwiped({
        direction: newIndex > previousIndex ? "up" : "down",
        position: newIndex + 1,
      });
    },
    [media],
  );

  const updateCurrentCard = useCallback(
    (event: ScrollEvent) => {
      "worklet";
      const heightFromTop = event.contentOffset.y;
      const progress = heightFromTop / event.layoutMeasurement.height;
      const newCurrentIndex = Math.round(progress);

      // Only update if the index has changed, not on every scroll event
      if (indexTracker.value !== newCurrentIndex) {
        const previousIndex = indexTracker.value;
        indexTracker.value = newCurrentIndex;
        scheduleOnRN(changeCard, newCurrentIndex, previousIndex);
      }
    },
    [indexTracker, changeCard],
  );

  const { scrollHandler, scrollY, isDragging } = useScrollPosition({
    onMomentumEnd: updateCurrentCard,
  });

  // Reset scroll position when data resets
  const resetScroll = useCallback(() => {
    scrollY.value = 0;
    indexTracker.value = 0;
    setCurrentIndex(0);
  }, [scrollY, indexTracker]);

  return { scrollHandler, scrollY, isDragging, currentIndex, resetScroll };
};
