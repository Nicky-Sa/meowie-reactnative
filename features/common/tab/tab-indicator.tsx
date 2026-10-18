import { TabBarProps } from "react-native-collapsible-tab-view";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

export type TabLayout = {
  x: number;
  width: number;
};

type Props = {
  index: TabBarProps["index"];
  tabLayouts: TabLayout[];
};

const spring = { damping: 20, stiffness: 150, mass: 0.5 };

export const TabIndicator = ({ index, tabLayouts }: Props) => {
  const indexes = tabLayouts.map((_, tabIndex) => tabIndex);
  const widths = tabLayouts.map((layout) => layout.width);
  const positions = tabLayouts.map((layout) => layout.x);

  const animatedStyle = useAnimatedStyle(() => {
    if (tabLayouts.length === 0) return { width: 0 };

    const width =
      tabLayouts.length === 1
        ? widths[0]
        : interpolate(index.value, indexes, widths, Extrapolation.CLAMP);
    const position =
      tabLayouts.length === 1
        ? positions[0]
        : interpolate(index.value, indexes, positions, Extrapolation.CLAMP);

    return {
      width: withSpring(width, spring),
      transform: [{ translateX: withSpring(position, spring) }],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-0 left-0 z-10 items-center justify-center"
    >
      <View className="h-[3px] w-1/2 rounded-t-sm bg-neutral-1-default" />
    </Animated.View>
  );
};
