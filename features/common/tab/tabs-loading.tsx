import { LayoutChangeEvent, View } from "react-native";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import { useGridItemWidth } from "@/features/common/hooks/list/use-grid-item-width";
import { TabBarSkeleton } from "@/features/common/tab/tab-bar-skeleton";
import { tailwind } from "@/lib/tailwind";

const NUM_COLUMNS = 3;

type Props = {
  topBarHeight: number;
  tabCount: number;
  scrollable: boolean;
  onTabBarLayout: (event: LayoutChangeEvent) => void;
};

// Lines up with the loaded screen, so the real tabs and posters swap in without moving.
export const TabsLoading = ({
  topBarHeight,
  tabCount,
  scrollable,
  onTabBarLayout,
}: Props) => {
  const gap = Number(tailwind.theme.spacing["2"]);
  const { itemWidth } = useGridItemWidth({
    numColumns: NUM_COLUMNS,
    gap,
    horizontalPadding: gap * 2,
  });

  return (
    <View className="absolute inset-0" style={{ paddingTop: topBarHeight }}>
      <TabBarSkeleton
        tabCount={tabCount}
        scrollable={scrollable}
        onLayout={onTabBarLayout}
      />
      <View className="px-1 pt-2">
        <PostersSkeletons width={itemWidth} number={NUM_COLUMNS * 4} />
      </View>
    </View>
  );
};
