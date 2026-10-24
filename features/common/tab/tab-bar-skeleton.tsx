import { LayoutChangeEvent, View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { cn } from "@/lib/tailwind";

type Props = {
  tabCount: number;
  scrollable: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
};

// Same height as TabBar: its h-12 row plus the 2px bottom border.
export const TabBarSkeleton = ({ tabCount, scrollable, onLayout }: Props) => {
  return (
    <View onLayout={onLayout} className="border-b-2 border-neutral-5-default">
      <View
        className={cn("h-12 flex-row items-center", scrollable && "gap-8 px-4")}
      >
        {Array.from({ length: tabCount }).map((_, index) => (
          <View
            key={index}
            className={cn(!scrollable && "flex-1 items-center")}
          >
            <SkeletonItem className="h-5 w-24" />
          </View>
        ))}
      </View>
    </View>
  );
};
