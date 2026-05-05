import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

export const MediaInfoSkeleton = () => {
  return (
    <View
      className={
        "flex w-full flex-1 flex-col items-center justify-center gap-4"
      }
    >
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
