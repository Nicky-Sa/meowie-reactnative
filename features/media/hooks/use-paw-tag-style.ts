import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// Timings, distances and curves come from the tag's Motion timeline in Figma.
const SHOW_DELAY = 1000;
const RISE_DISTANCE = 72;
const RISE_DURATION = 1440;
const RISE_EASING = Easing.bezier(0.22, 1, 0.36, 1);
const FADE_DURATION = 280;
const WIGGLE_STEP_DURATION = 1600;
const WIGGLE_ANGLE = 1.2;
const WIGGLE_SHIFT = 1.5;
const SMOOTH_EASING = Easing.bezier(0.42, 0, 0.58, 1);

/** Raises the tag 1 second after its card shows, then tilts it left and right until the card leaves. */
export const usePawTagStyle = (inScreen: boolean) => {
  // 0 is hidden below its place, 1 is in place
  const rise = useSharedValue(0);
  const opacity = useSharedValue(0);
  // -1 is tilted left, 1 is tilted right
  const tilt = useSharedValue(0);

  useEffect(() => {
    // Setting a value stops the animation running on it.
    if (!inScreen) {
      rise.value = 0;
      opacity.value = 0;
      tilt.value = 0;
      return;
    }

    const wiggleStep = {
      duration: WIGGLE_STEP_DURATION,
      easing: SMOOTH_EASING,
    };

    opacity.value = withDelay(
      SHOW_DELAY,
      withTiming(1, { duration: FADE_DURATION, easing: SMOOTH_EASING }),
    );
    rise.value = withDelay(
      SHOW_DELAY,
      withTiming(1, { duration: RISE_DURATION, easing: RISE_EASING }),
    );
    tilt.value = withDelay(
      SHOW_DELAY + RISE_DURATION,
      withRepeat(
        withSequence(
          withTiming(1, wiggleStep),
          withTiming(0, wiggleStep),
          withTiming(-1, wiggleStep),
          withTiming(0, wiggleStep),
        ),
        -1,
      ),
    );
  }, [inScreen, rise, opacity, tilt]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: tilt.value * WIGGLE_SHIFT },
      {
        translateY:
          (1 - rise.value) * RISE_DISTANCE -
          Math.abs(tilt.value) * WIGGLE_SHIFT,
      },
      { rotate: `${tilt.value * WIGGLE_ANGLE}deg` },
    ],
  }));
};
