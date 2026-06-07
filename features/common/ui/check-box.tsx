import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Check, Minus } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { tailwind } from "@/lib/tailwind";

export type CheckboxState = "unchecked" | "checked" | "indeterminate";

type Props = {
  state: CheckboxState;
  onPress: () => void;
};

export const Checkbox = ({ state, onPress }: Props) => {
  const isChecked = useSharedValue(state === "checked" ? 1 : 0);
  const isIndeterminate = useSharedValue(state === "indeterminate" ? 1 : 0);
  const isActive = useSharedValue(state !== "unchecked" ? 1 : 0);

  useEffect(() => {
    const springConfig = { damping: 12, stiffness: 150, mass: 0.8 };

    isChecked.value = withSpring(state === "checked" ? 1 : 0, springConfig);
    isIndeterminate.value = withSpring(
      state === "indeterminate" ? 1 : 0,
      springConfig,
    );
    isActive.value = withSpring(state !== "unchecked" ? 1 : 0, springConfig);
  }, [state, isChecked, isIndeterminate, isActive]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isActive.value,
        [0, 1],
        [
          tailwind.theme.backgroundColor.neutral[14].default,
          tailwind.theme.backgroundColor.brand[1].default,
        ],
      ),
      borderColor: interpolateColor(
        isActive.value,
        [0, 1],
        [
          tailwind.theme.borderColor.neutral[10].default,
          tailwind.theme.backgroundColor.brand[1].default,
        ],
      ),
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: isChecked.value,
      transform: [
        {
          scale: interpolate(
            isChecked.value,
            [0, 1],
            [0.5, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const minusStyle = useAnimatedStyle(() => {
    return {
      opacity: isIndeterminate.value,
      transform: [
        {
          scale: interpolate(
            isIndeterminate.value,
            [0, 1],
            [0.5, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        className="h-5 w-5 items-center justify-center rounded-sm border-2"
        style={containerStyle}
      >
        {/* Checkmark Icon */}
        <Animated.View
          className="absolute inset-0 items-center justify-center"
          style={checkStyle}
        >
          <Icon i={Check} strokeWidth={3} width={16} height={16} />
        </Animated.View>

        {/* Indeterminate (Minus) Icon */}
        <Animated.View
          className="absolute inset-0 items-center justify-center"
          style={minusStyle}
        >
          <Icon i={Minus} strokeWidth={2} width={16} height={16} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};
