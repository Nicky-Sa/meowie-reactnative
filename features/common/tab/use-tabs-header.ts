import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useScrollDownProgress } from "@/features/common/hooks/list/use-scroll-down-progress";
import { tailwind } from "@/lib/tailwind";

const headerBackgroundColor =
  tailwind.theme.backgroundColor.neutral[15].default;

type Args = {
  initialTabName: string;
  // The key of the tab view. A new key rebuilds it, so its tabs must draw again.
  tabsKey: string;
};

/**
 * Shared header logic for tab screens whose header floats over the lists:
 * the top bar and the tab row fade in and slide away together on scroll.
 */
export const useTabsHeader = ({ initialTabName, tabsKey }: Args) => {
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  // Stays 0 until both parts are measured, so nothing is placed with a wrong height.
  const headerHeight =
    topBarHeight > 0 && tabBarHeight > 0 ? topBarHeight + tabBarHeight : 0;
  // The tab library mounts the open tab a moment late, so the loading
  // skeleton stays on top until that tab has drawn.
  const [readyTabsKey, setReadyTabsKey] = useState<string | null>(null);
  const isTabReady = readyTabsKey === tabsKey;
  const scrollPositions = useSharedValue<Record<string, number>>({});
  const activeTabName = useSharedValue(initialTabName);
  const activeScrollY = useDerivedValue(
    () => scrollPositions.value[activeTabName.value] ?? 0,
  );
  const { progress: headerAnimation, reset: resetHeader } =
    useScrollDownProgress({ scrollY: activeScrollY, tabName: activeTabName });

  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeScrollY.value,
      // Wider range = gentler fade. Tweak if you want it faster or slower.
      [0, 150],
      ["transparent", headerBackgroundColor],
    ),
    transform: [{ translateY: -headerHeight * headerAnimation.value }],
  }));

  const onTopBarLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setTopBarHeight(layout.height);
  };

  const onTabBarLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setTabBarHeight(layout.height);
  };

  const onTabReady = useCallback(() => setReadyTabsKey(tabsKey), [tabsKey]);

  return {
    topBarHeight,
    headerHeight,
    headerStyle,
    onTopBarLayout,
    onTabBarLayout,
    isTabReady,
    onTabReady,
    scrollPositions,
    activeTabName,
    resetHeader,
  };
};
