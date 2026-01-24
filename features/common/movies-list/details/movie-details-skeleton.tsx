import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

export const MovieDetailsSkeleton = () => {
  return (
    <View className={"flex w-full flex-col gap-4"}>
      <SkeletonItem className={"h-[90px]"} />
      <SkeletonItem className={"h-56"} />
      <SkeletonItem className={"h-6"} />
      <SkeletonItem className={"h-14"} />
      <SkeletonItem className={"h-6"} />
      <SkeletonItem className={"h-6"} />
      <SkeletonItem className={"h-10"} />
    </View>
  );
};
