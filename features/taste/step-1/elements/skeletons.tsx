import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

const LENGTH = 10;

export const Skeletons = () => {
  return (
    <View className={"flex flex-col gap-2"}>
      {Array.from({ length: LENGTH }).map((_, i) => (
        <View key={i} className={"px-6"}>
          <SkeletonItem className={"h-1 w-full p-8"} />
        </View>
      ))}
    </View>
  );
};
