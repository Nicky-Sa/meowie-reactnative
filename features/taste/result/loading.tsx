import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSlidingBarStyle } from "@/features/taste/result/hooks/use-sliding-bar-style";
import { useShownTitles } from "@/features/taste/result/hooks/use-shown-titles";
import { PickedPosters } from "@/features/taste/result/picked-posters";
import { TitlePick } from "@/features/taste/data/dto/taste.dto";

type Props = {
  picks: TitlePick[];
};

export const LoadingTasteSubmission = ({ picks }: Props) => {
  const barStyle = useSlidingBarStyle();
  const shownTitles = useShownTitles(picks);

  return (
    <View
      className={"flex flex-1 flex-col items-center justify-center gap-4 px-6"}
    >
      <PickedPosters titles={shownTitles} />
      <Text className={"title-t1-strong text-center text-neutral-10-default"}>
        Great picks!
      </Text>
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        Creating your personalized home feed...
      </Text>
      <View
        className={
          "h-[18px] w-[164px] overflow-hidden rounded-full bg-neutral-13-default"
        }
      >
        <Animated.View
          className={
            "absolute top-1 h-2.5 w-[90px] rounded-full bg-brand-1-default"
          }
          style={barStyle}
        />
      </View>
    </View>
  );
};
