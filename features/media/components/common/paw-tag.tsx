import { View } from "react-native";
import Animated from "react-native-reanimated";
import { Badge } from "@/features/common/ui/badge";
import { usePawTagStyle } from "@/features/media/hooks/use-paw-tag-style";
import Paw from "@/assets/images/paw-tag/paw.svg";
import Pole from "@/assets/images/paw-tag/pole.svg";

type Props = {
  text: string;
  inScreen: boolean;
};

/** A sign held up by a cat's paw. The view drawn after it covers the bottom of its pole. */
export const PawTag = ({ text, inScreen }: Props) => {
  const pawTagStyle = usePawTagStyle(inScreen);

  return (
    <Animated.View
      pointerEvents="none"
      style={pawTagStyle}
      className={"absolute bottom-full right-4 pb-4 pt-2"}
    >
      <View className={"absolute left-1/2 top-0 ml-1"}>
        <Pole />
      </View>
      <Badge text={text} variant={"primary"} />
      <View className={"absolute left-1/2 top-0 ml-1"}>
        <Paw />
      </View>
    </Animated.View>
  );
};
