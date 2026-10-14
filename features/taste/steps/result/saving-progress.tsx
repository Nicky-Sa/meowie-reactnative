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
const BAR_WIDTH = 84;

// The request has no measured progress, so the bar keeps moving until it ends.
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
        className={
          "h-3 w-52 overflow-hidden rounded-full bg-neutral-13-default"
        }
      >
        <Animated.View
          className={"h-full w-[84px] rounded-full bg-brand-1-default"}
          style={barStyle}
        />
      </View>
    </View>
  );
};
