import { View } from "react-native";
import Animated from "react-native-reanimated";
import SleepingMeowie from "@/assets/images/meowie/sleeping-meowie.svg";
import { InformationBlock } from "@/features/common/information-block";
import { useSlidingBarStyle } from "@/features/taste/result/hooks/use-sliding-bar-style";

export const LoadingTasteSubmission = () => {
  const barStyle = useSlidingBarStyle();

  return (
    <InformationBlock
      img={SleepingMeowie}
      text={"Creating your\npersonalized home feed…"}
    >
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
    </InformationBlock>
  );
};
