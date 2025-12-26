import { View } from "react-native";
import { SkeletonItem } from "@/features/common/skeleton-item";

type Props = {
  width: number;
  number: number;
};

export const PostersSkeletons = ({ width, number }: Props) => {
  const height = width * (3 / 2);
  return (
    <View className={"flex flex-row flex-wrap"}>
      {Array.from({ length: number }).map((_, index) => (
        <SkeletonItem
          key={index}
          className={"rounded-none border border-neutral-4-default"}
          style={{ width, height }}
        />
      ))}
    </View>
  );
};
