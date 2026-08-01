import * as Haptics from "expo-haptics";
import {
  Pressable,
  PressableProps,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { cn, tailwind } from "@/lib/tailwind";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loading } from "@/features/common/ui/loading";

const WAKE_UP_PEAK = 1.03;
const WAKE_UP_SPRING = { damping: 10, stiffness: 260, mass: 0.6 };

const buttonVariants = {
  primary: {
    backgroundColor: tailwind.theme.backgroundColor.info[1].default,
    borderColor: tailwind.theme.borderColor.brand[1].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 1,
  },
  white: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[1].default,
    borderColor: tailwind.theme.borderColor.neutral[7].default,
    textColor: tailwind.theme.textColor.neutral[1].default,
    borderWidth: 1,
  },
  black: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[14].default,
    borderColor: tailwind.theme.borderColor.neutral[3].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 0,
  },
  // for links, with no padding, no text direction
  link: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 0,
  },
  // for segments in selectable
  "unselected-segment": {
    backgroundColor: tailwind.theme.backgroundColor.neutral[15].default,
    borderColor: tailwind.theme.borderColor.neutral[3].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 2,
  },
  "selected-segment": {
    backgroundColor: tailwind.theme.backgroundColor.neutral[14].default,
    borderColor: tailwind.theme.borderColor.brand[1].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 2,
  },
} as const;

const buttonSizes = {
  segment: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
    iconOffset: 4,
  },
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
    iconOffset: 8,
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["3"]),
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
    iconOffset: 4,
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["2"]),
    paddingHorizontal: Number(tailwind.theme.spacing["3"]),
    iconOffset: 4,
  },
  unset: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    iconOffset: 0,
  },
};

type Props = PressableProps & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  haptic?: boolean;
  iconPosition?: "left" | "right" | "only";
  isLoading?: boolean;
  icon?: ReactNode;
};

// A small pop the moment the button turns on, so a button that starts enabled
// stays still.
const useWakeUpScale = (disabled: boolean | null | undefined) => {
  const scale = useSharedValue(1);
  const wasDisabled = useRef(!!disabled);

  useEffect(() => {
    if (wasDisabled.current && !disabled) {
      scale.value = withSequence(
        withTiming(WAKE_UP_PEAK, { duration: 120 }),
        withSpring(1, WAKE_UP_SPRING),
      );
    }
    wasDisabled.current = !!disabled;
  }, [disabled, scale]);

  return scale;
};

export const Button = ({
  variant = "primary",
  size = "lg",
  haptic = true,
  isLoading,
  icon,
  iconPosition = "left",
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [focused, setFocused] = useState(false);
  const textOnly = typeof children === "string" && !!children;
  const iconOnly = iconPosition === "only";

  const animatedOpacity = useDerivedValue(() => {
    return withTiming(props.disabled ? 0.5 : focused ? 0.7 : 1, {
      duration: 150,
    });
  }, [props.disabled, focused]);

  const wakeUpScale = useWakeUpScale(props.disabled);

  const animatedBg = useDerivedValue(() => {
    return withTiming(buttonVariants[variant].backgroundColor, {
      duration: 150,
    });
  }, [variant]);

  const animatedBorder = useDerivedValue(() => {
    return withTiming(buttonVariants[variant].borderColor, {
      duration: 150,
    });
  }, [variant]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
      backgroundColor: animatedBg.value,
      borderColor: animatedBorder.value,
      transform: [{ scale: wakeUpScale.value }],
    };
  });

  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        setFocused(true);
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        setFocused(false);
        props.onPressOut?.(ev);
      }}
      onPress={(ev) => {
        if (haptic) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPress?.(ev);
      }}
      disabled={props.disabled || isLoading}
    >
      <Animated.View
        className={cn("overflow-hidden")}
        style={[
          {
            borderRadius:
              variant !== "link" ? buttonSizes[size].borderRadius : 0,
            borderWidth: buttonVariants[variant].borderWidth,
            paddingVertical:
              variant !== "link" ? buttonSizes[size].paddingVertical : 0,
            paddingHorizontal:
              variant !== "link"
                ? iconOnly
                  ? buttonSizes[size].paddingVertical
                  : buttonSizes[size].paddingHorizontal
                : 0,
          },
          animatedStyle,
          props.style as StyleProp<ViewStyle>,
        ]}
      >
        {isLoading ? (
          <View className={cn(props.className)}>
            <Loading />
          </View>
        ) : (
          <View
            className={cn(
              "flex-row items-center gap-2",
              (textOnly || !!icon) &&
                variant !== "link" &&
                "h-6 justify-center", // for absolute bare text
              props.className,
            )}
            style={textOnly ? { gap: buttonSizes[size].iconOffset } : undefined}
          >
            {(iconPosition === "left" || iconPosition === "only") && icon}
            {!iconOnly &&
              (textOnly ? (
                <Text
                  style={{
                    color: buttonVariants[variant].textColor,
                  }}
                  className={cn({
                    "text-center": variant !== "link",
                    "body-b1-strong": size === "lg",
                    "body-b2-strong": size === "md",
                    "caption-c1-strong": size === "sm",
                  })}
                >
                  {children}
                </Text>
              ) : (
                children
              ))}
            {iconPosition === "right" && icon}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
