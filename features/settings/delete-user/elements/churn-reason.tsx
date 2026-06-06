import { View, Text } from "react-native";
import { Updater } from "use-immer";
import { Segment } from "@/features/common/ui/segment";
import { useChurnReasons } from "@/features/general/data/constants/use-churn-reasons";

type Props = {
  churnReasonId: string;
  setChurnReasonId: Updater<string>;
};

export const ChurnReason = ({ churnReasonId, setChurnReasonId }: Props) => {
  const { data } = useChurnReasons();
  if (!data || !data.reasons) return null;

  return (
    <View className={"flex flex-col gap-4"}>
      <Text className={"body-b1 text-neutral-10-default"}>
        Help us improve. Why are you deleting your account? (Optional)
      </Text>
      <View className={"flex flex-col gap-2"}>
        {data.reasons.map((reason) => (
          <Segment
            key={reason.id}
            item={reason}
            currentValues={churnReasonId}
            setCurrentValues={setChurnReasonId}
          />
        ))}
      </View>
    </View>
  );
};
