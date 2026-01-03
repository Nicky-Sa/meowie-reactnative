import { Icon, SvgImage } from "@/features/common/ui/icon";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { tailwind } from "@/lib/tailwind";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { Pressable, Text } from "react-native";

// Wrap the custom Icon and Text so they can accept animated props
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedText = Animated.createAnimatedComponent(Text);

type Props = {
  name: string;
  icon: SvgImage;
  index: number;
  currentIndex: TabBarProps["index"];
  onPress: () => void;
};

export const TabItem = ({
  name,
  icon,
  index,
  currentIndex,
  onPress,
}: Props) => {
  const activeColor = tailwind.theme.textColor.neutral[10].default;
  const inactiveColor = tailwind.theme.textColor.neutral[6].default;

  // Logic: If currentIndex is 0.5, we are halfway between tab 0 and 1.
  // We check the distance between the current animated index and this tab's index.

  // 1. Text Style Animation (Color)
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      currentIndex.value,
      [index - 1, index, index + 1],
      [inactiveColor, activeColor, inactiveColor],
    );
    return { color };
  });

  // 2. Icon Prop Animation (Color)
  // We use useAnimatedProps because 'color' is a prop, not a style, on your Icon component
  const animatedIconProps = useAnimatedProps(() => {
    const color = interpolateColor(
      currentIndex.value,
      [index - 1, index, index + 1],
      [inactiveColor, activeColor, inactiveColor],
    );
    return { color: color as string };
  });

  return (
    <Pressable onPress={onPress} className="flex-1 items-center justify-center">
      <Animated.View className="flex flex-row items-center justify-center gap-2">
        <AnimatedIcon i={icon} animatedProps={animatedIconProps} />
        <AnimatedText className="body-b1-strong" style={animatedTextStyle}>
          {name}
        </AnimatedText>
      </Animated.View>
    </Pressable>
  );
};
