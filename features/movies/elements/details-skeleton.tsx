import { View } from "react-native";
import { SkeletonItem } from "@/features/common/skeleton-item";

export const DetailsSkeleton = () => {
  return (
    <View
      className={
        "flex w-full flex-1 flex-col items-center justify-center gap-4"
      }
    >
      <SkeletonItem className={"h-20"} />
      <SkeletonItem className={"h-48"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-16"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-16"} />
    </View>
  );
};
