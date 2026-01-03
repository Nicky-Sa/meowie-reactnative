import { TabBarProps } from "react-native-collapsible-tab-view";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type Props = {
  index: TabBarProps["index"];
  tabWidth: number;
};

export const TabIndicator = ({ index, tabWidth }: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate where the line SHOULD be
    const targetX = index.value * tabWidth;

    return {
      transform: [
        {
          // We wrap targetX in withSpring.
          // Even if index.value jumps instantly from 0 -> 1,
          // withSpring will smoothly animate the transition.
          translateX: withSpring(targetX, {
            damping: 20,
            stiffness: 150,
            mass: 0.5, // Lightweight feel
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-0 left-[13%] z-10 h-[3px] w-1/4 rounded-t-sm bg-neutral-1-default"
    />
  );
};
