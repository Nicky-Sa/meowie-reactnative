import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

type Props = {
  width: number;
  number: number;
};

export const PostersSkeletons = ({ width, number }: Props) => {
  const height = width * (3 / 2);
  return (
    <View className={"flex flex-row flex-wrap gap-2 px-1"}>
      {Array.from({ length: number }).map((_, index) => (
        <SkeletonItem
          key={index}
          className={"rounded-lg border border-neutral-4-default"}
          style={{ width, height }}
        />
      ))}
    </View>
  );
};
