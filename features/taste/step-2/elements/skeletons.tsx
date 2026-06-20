import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { View } from "react-native";

export const Skeletons = () => {
  return (
    <View className="flex w-full flex-row justify-center gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonItem key={index} className={"h-12 w-24"} />
      ))}
    </View>
  );
};
