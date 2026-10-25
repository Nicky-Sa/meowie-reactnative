import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const Switch = ({ value, onValueChange }: Props) => {
  // 0 for off, 1 for on
  const offset = useSharedValue(value ? 1 : 0);

  // Synchronize the shared value with the prop
  useEffect(() => {
    offset.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [offset, value]);

  // Animate the track's background color
  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.value,
      [0, 1],
      [
        tailwind.theme.backgroundColor.neutral[10].default,
        tailwind.theme.backgroundColor.brand[1].default,
      ], // Gray (Off) vs. Purple (On)
    );
    return { backgroundColor };
  });

  // Animate the thumb's position
  const animatedThumbStyle = useAnimatedStyle(() => {
    // The thumb travels 24px
    return {
      transform: [{ translateX: offset.value * 24 }],
    };
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className="active:opacity-90" // Subtle press feedback
    >
      <Animated.View
        // Track styles
        className="h-6 w-12 justify-center rounded-full p-1"
        style={animatedTrackStyle}
      >
        <Animated.View
          // Thumb styles
          className="h-4 w-4 rounded-full bg-neutral-1-default shadow-sm"
          style={animatedThumbStyle}
        />
      </Animated.View>
    </Pressable>
  );
};
