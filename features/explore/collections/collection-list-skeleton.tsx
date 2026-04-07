import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { View } from "react-native";

export const CollectionListSkeleton = () => {
  return (
    <View className={"flex w-full flex-1 flex-col gap-4"}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonItem key={index} className={"h-24"} />
      ))}
    </View>
  );
};
