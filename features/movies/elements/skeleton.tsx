import { View } from "react-native";
import { useMainContentStyle } from "@/features/common/hooks/useMainContentStyle";
import { SkeletonItem } from "@/features/common/skeleton-item";

export const MoviesSkeleton = () => {
  const contentStyle = useMainContentStyle();

  return (
    <View className={"w-full flex-1 justify-start"}>
      <View
        className={
          "flex animate-pulse flex-col items-start justify-start gap-4 px-4"
        }
        style={contentStyle}
      >
        <SkeletonItem className={"h-20"} />
        <SkeletonItem className={"h-48"} />
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-16"} />
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-16"} />
      </View>
    </View>
  );
};
