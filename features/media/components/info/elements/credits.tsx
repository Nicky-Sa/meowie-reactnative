import { View } from "react-native";
import { CreditInfo } from "@/features/common/data/models/credit";
import { Credit } from "@/features/media/components/info/elements/credit";

type Props = {
  credits: CreditInfo[];
};

export const Credits = ({ credits }: Props) => {
  return (
    <View className={"flex flex-row gap-5"}>
      {credits.map((credit) => (
        <Credit key={credit.id} {...credit} />
      ))}
    </View>
  );
};
