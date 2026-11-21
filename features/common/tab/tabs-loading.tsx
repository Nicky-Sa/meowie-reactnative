import { LayoutChangeEvent, View } from "react-native";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import { TabBarSkeleton } from "@/features/common/tab/tab-bar-skeleton";

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
  return (
    <View className="absolute inset-0" style={{ paddingTop: topBarHeight }}>
      <TabBarSkeleton
        tabCount={tabCount}
        scrollable={scrollable}
        onLayout={onTabBarLayout}
      />
      <View className="px-1 pt-2">
        <PostersSkeletons />
      </View>
    </View>
  );
};
