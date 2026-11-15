import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import SleepingMeowie from "@/assets/images/meowie/sleeping-meowie.svg";
import { useSlidingBarStyle } from "@/features/taste/steps/result/hooks/use-sliding-bar-style";

export const LoadingTasteSubmission = () => {
  const barStyle = useSlidingBarStyle();

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
