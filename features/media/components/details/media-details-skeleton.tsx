import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

export const MediaDetailsSkeleton = () => {
  return (
    <View
      className={
        "flex w-full flex-1 flex-col items-center justify-start gap-3 px-4"
      }
    >
      <SkeletonItem className={"h-72"} />
      <SkeletonItem className={"h-52"} />
      <View className={"flex flex-row gap-2"}>
        <SkeletonItem className={"h-12 max-w-[48%]"} />
        <SkeletonItem className={"h-12 max-w-[48%]"} />
      </View>
      <SkeletonItem className={"h-16"} />
      <SkeletonItem className={"h-52"} />
    </View>
  );
};
