import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

export const MediaInfoSkeleton = () => {
  return (
    <View
      className={
        "flex w-full flex-1 flex-col justify-center gap-2 py-2 tall-sm:gap-4 tall-sm:py-6"
      }
    >
      <SkeletonItem className={"max-h-[230px] flex-1 tall-sm:max-h-[280px]"} />

      {/* Title, ratings and info row: 36 + 8 + 24 + the card's gap + 16 */}
      <SkeletonItem className={"h-[92px] tall-sm:h-[100px]"} />

      <View className={"flex flex-col gap-2 tall-sm:gap-4"}>
        <View className={"flex w-full flex-row gap-2"}>
          <SkeletonItem className={"h-[90px] w-[60px]"} />
          <View className={"flex flex-1 flex-col gap-3"}>
            <SkeletonItem className={"h-12"} />
            <SkeletonItem className={"h-6"} />
          </View>
        </View>
        <SkeletonItem className={"h-7"} />
      </View>

      <SkeletonItem className={"h-12"} />
    </View>
  );
};
