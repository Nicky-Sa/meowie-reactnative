import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// The wait lets the screen finish appearing, so the shrink is seen from its start.
const START_DELAY = 500;
const SHRINK_DURATION = 700;
const FAN_OUT_DURATION = 600;

export type FanOffset = {
  x: number;
  y: number;
  rotation: number;
  startScale: number;
};

/** Shrinks a poster to its size, then moves it from the stack in the middle out to its place in the fan, once. */
export const useFanOutStyle = ({ x, y, rotation, startScale }: FanOffset) => {
  const scale = useSharedValue(startScale);
  const progress = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      START_DELAY,
      withTiming(1, {
        duration: SHRINK_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );
    progress.value = withDelay(
      START_DELAY + SHRINK_DURATION,
      withTiming(1, {
        duration: FAN_OUT_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [scale, progress]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: x * progress.value },
      { translateY: y * progress.value },
      { rotate: `${rotation * progress.value}deg` },
      { scale: scale.value },
    ],
  }));
};
