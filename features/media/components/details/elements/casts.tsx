import { View } from "react-native";
import { CastInfo } from "@/features/common/data/models/cast";
import { Cast } from "@/features/media/components/details/elements/cast";

type Props = {
  casts: CastInfo[];
};

export const Casts = ({ casts }: Props) => {
  return (
    <View className={"flex flex-row gap-5 px-4"}>
      {casts.map((cast) => (
        <Cast key={cast.id} {...cast} />
      ))}
    </View>
  );
};
