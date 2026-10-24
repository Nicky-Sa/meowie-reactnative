import { LayoutChangeEvent, View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

const PLACEHOLDER_COUNT = 3;

type Props = {
  onLayout: (event: LayoutChangeEvent) => void;
};

// Same height as TabBar: its h-12 row plus the 2px bottom border.
export const TabBarSkeleton = ({ onLayout }: Props) => {
  return (
    <View onLayout={onLayout} className="border-b-2 border-neutral-5-default">
      <View className="h-12 flex-row items-center gap-8 px-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <SkeletonItem key={index} className="h-5 w-24" />
        ))}
      </View>
    </View>
  );
};
