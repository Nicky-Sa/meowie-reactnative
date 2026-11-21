import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const TRACK_WIDTH = 164;
const BAR_WIDTH = 90;

/** Slides the bar across its track again and again, because the request has no measured progress to show. */
export const useSlidingBarStyle = () => {
  const offset = useSharedValue(-BAR_WIDTH);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(TRACK_WIDTH, {
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, [offset]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));
};
