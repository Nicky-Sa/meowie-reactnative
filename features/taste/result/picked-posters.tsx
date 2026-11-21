import { View } from "react-native";
import Animated from "react-native-reanimated";
import { PlainPoster } from "@/features/common/posters/plain-poster";
import { PickTitle } from "@/features/taste/data/dto/journey.dto";
import { posterSubtitle } from "@/features/taste/utils/labels";
import { pickKey } from "@/features/taste/state";
import {
  FanOffset,
  useFanOutStyle,
} from "@/features/taste/result/hooks/use-fan-out-style";
import { tailwind } from "@/lib/tailwind";

const POSTER_WIDTH = 121;

// Figma's fan, measured from the middle poster: left tilted back, right tilted forward.
// The middle one is drawn last, so it sits on top of the stack before the fan opens.
const FAN_OFFSETS: FanOffset[] = [
  { x: -60, y: 14, rotation: -10, startScale: 1 },
  { x: 58, y: 35, rotation: 10, startScale: 1 },
  { x: 0, y: 0, rotation: 0, startScale: 1.5 },
];

type FannedPosterProps = {
  title: PickTitle;
  offset: FanOffset;
};

const FannedPoster = ({ title, offset }: FannedPosterProps) => {
  const fanOutStyle = useFanOutStyle(offset);

  return (
    <Animated.View className={"absolute left-[95px] top-0"} style={fanOutStyle}>
      <PlainPoster
        posterUri={title.poster}
        width={POSTER_WIDTH}
        recyclingKey={title.poster}
        title={title.title}
        subtitle={posterSubtitle(title)}
        borderColor={tailwind.theme.borderColor.neutral[2].default}
        borderWidth={1}
      />
    </Animated.View>
  );
};

type Props = {
  titles: PickTitle[];
};

export const PickedPosters = ({ titles }: Props) => {
  return (
    <View className={"h-[230px] w-[300px]"}>
      {titles.map((title, index) => (
        <FannedPoster
          key={pickKey(title)}
          title={title}
          offset={FAN_OFFSETS[index]}
        />
      ))}
    </View>
  );
};
