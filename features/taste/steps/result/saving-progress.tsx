import { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import SleepingMeowie from "@/assets/images/meowie/sleeping-meowie.svg";

const TRACK_WIDTH = 208;
const TRACK_HEIGHT = 12;
const BAR_WIDTH = 84;

// Shown while the taste profile is being stored and the type is computed. The
// bar is indeterminate on purpose — the real wait is a backend round trip of
// unknown length (see the save call in screen.tsx), not a measurable amount
// of progress.
export const SavingProgress = () => {
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

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-6"}>
      <SleepingMeowie />
      <Text className={"body-b1 text-center text-neutral-8-default"}>
        Creating your{"\n"}personalized home feed…
      </Text>
      <View
        className={"overflow-hidden rounded-full bg-neutral-13-default"}
        style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
      >
        <Animated.View
          className={"h-full rounded-full bg-brand-1-default"}
          style={[{ width: BAR_WIDTH }, barStyle]}
        />
      </View>
    </View>
  );
};
