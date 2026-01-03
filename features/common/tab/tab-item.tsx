import { Icon, SvgImage } from "@/features/common/ui/icon";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { tailwind } from "@/lib/tailwind";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable, Text } from "react-native";

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

  // Use withSpring for Opacity too so the text color doesn't snap instantly
  const activeAnimatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;
    return {
      opacity: withSpring(isActive ? 1 : 0, { mass: 0.5 }),
    };
  });

  const inactiveAnimatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;
    return {
      opacity: withSpring(isActive ? 0 : 1, { mass: 0.5 }),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      className="relative flex-1 items-center justify-center py-3"
    >
      {/* Inactive Layer */}
      <Animated.View
        style={inactiveAnimatedStyle}
        className="flex flex-row items-center justify-center gap-2"
      >
        <Icon i={icon} color={inactiveColor} />
        <Text className="body-b1-strong" style={{ color: inactiveColor }}>
          {name}
        </Text>
      </Animated.View>

      {/* Active Layer (Overlay) */}
      <Animated.View
        style={activeAnimatedStyle}
        className="absolute inset-0 flex flex-row items-center justify-center gap-2"
        pointerEvents="none"
      >
        <Icon i={icon} color={activeColor} />
        <Text className="body-b1-strong" style={{ color: activeColor }}>
          {name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
