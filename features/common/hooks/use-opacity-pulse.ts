import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Tailwind's `pulse` curve. One second each way makes its two-second pulse.
const PULSE_EASING = Easing.bezier(0.4, 0, 0.6, 1);

/** Fades opacity from 1 to 0.5 and back every 2 seconds, like Tailwind's `animate-pulse`. */
export const useOpacityPulse = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.5, { duration: 1000, easing: PULSE_EASING }),
      -1,
      true,
    );
  }, [opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};
