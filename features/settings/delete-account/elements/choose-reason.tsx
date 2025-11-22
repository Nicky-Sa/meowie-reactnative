import { View, Text } from "react-native";
import { Updater } from "use-immer";
import { Segment, SegmentItem } from "@/features/common/segment";

const reasons: SegmentItem[] = [
  {
    id: "1",
    label: "I don't like the app.",
  },
  {
    id: "2",
    label: "I found a better app.",
  },
  {
    id: "3",
    label: "The app is too slow or buggy.",
  },
  {
    id: "4",
    label: "I am concerned about my data privacy.",
  },
  {
    id: "5",
    label: "Other",
  },
];

type Props = {
  reasonId: string;
  setReasonId: Updater<string>;
};

export const ChooseReason = ({ reasonId, setReasonId }: Props) => {
  return (
    <View className={"flex flex-col gap-4"}>
      <Text className={"body-b1 text-neutral-10-default"}>
        Help us improve. Why are you deleting your account? (Optional)
      </Text>
      <View className={"flex flex-col gap-2"}>
        {reasons.map((reason) => (
          <Segment
            key={reason.id}
            item={reason}
            currentValues={reasonId}
            setCurrentValues={setReasonId}
          />
        ))}
      </View>
    </View>
  );
};
