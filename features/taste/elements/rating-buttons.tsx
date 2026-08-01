import { View } from "react-native";
import { ThumbsDown, ThumbsUp } from "iconoir-react-native";
import EyeClosed from "@/assets/icons/custom/eye-closed.svg";
import { Updater } from "use-immer";
import { Icon } from "@/features/common/ui/icon";
import { Segment, SegmentItem } from "@/features/common/ui/segment";
import { TitleAnswer } from "@/features/taste/data/dto/taste.dto";
import { tailwind } from "@/lib/tailwind";

const ANSWERS: SegmentItem[] = [
  {
    id: "dislike",
    icon: (
      <Icon i={ThumbsDown} color={tailwind.theme.textColor.error[1].default} />
    ),
  },
  {
    id: "not-seen",
    icon: <Icon i={EyeClosed} />,
  },
  {
    id: "like",
    icon: (
      <Icon i={ThumbsUp} color={tailwind.theme.textColor.success[1].default} />
    ),
  },
];

const NOT_RATED = "";

type Props = {
  answer: TitleAnswer | undefined;
  onRate: (answer: TitleAnswer) => void;
};

export const RatingButtons = ({ answer, onRate }: Props) => {
  // Segment only ever hands back a plain id in single-pick mode.
  const setAnswer: Updater<string> = (value) => {
    if (typeof value !== "function") onRate(value as TitleAnswer);
  };

  return (
    <View className={"flex flex-row gap-3"}>
      {ANSWERS.map((option) => (
        <View key={option.id} className={"flex-1"}>
          <Segment
            item={option}
            currentValues={answer ?? NOT_RATED}
            setCurrentValues={setAnswer}
            centered
          />
        </View>
      ))}
    </View>
  );
};
