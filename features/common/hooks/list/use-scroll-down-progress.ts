import { useCallback } from "react";
import {
  DerivedValue,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Args = {
  scrollY: DerivedValue<number>;
  // Switching tabs makes scrollY jump, so a tab change is not counted as scrolling
  tabName?: DerivedValue<string>;
};

export const useScrollDownProgress = ({ scrollY, tabName }: Args) => {
  // 0 = at the top or scrolling up, 1 = scrolling down
  const progress = useSharedValue(0);
  // We use this "Target" to lock the logic so we don't re-trigger animations unnecessarily
  const isScrolledDown = useSharedValue(false);

  useAnimatedReaction(
    () => ({ scrollY: scrollY.value, tabName: tabName?.value }),
    (current, previous) => {
      if (previous === null || current.tabName !== previous.tabName) return;
      const diff = current.scrollY - previous.scrollY;

      // Rule 1: Always go back to 0 if we are at the very top
      if (current.scrollY < 10 && isScrolledDown.value) {
        isScrolledDown.value = false;
        progress.value = withTiming(0, { duration: 200 });
        return;
      }

      // Rule 2: Scrolling Down -> 1
      // We add a threshold (diff > 2) to ignore tiny accidental movements
      if (diff > 2 && current.scrollY > 50 && !isScrolledDown.value) {
        isScrolledDown.value = true;
        progress.value = withTiming(1, { duration: 300 });
      }

      // Rule 3: Scrolling Up -> 0
      if (diff < -2 && isScrolledDown.value) {
        isScrolledDown.value = false;
        progress.value = withTiming(0, { duration: 300 });
      }
    },
  );

  const reset = useCallback(() => {
    isScrolledDown.value = false;
    progress.value = 0;
  }, [isScrolledDown, progress]);

  return { progress, reset };
};
