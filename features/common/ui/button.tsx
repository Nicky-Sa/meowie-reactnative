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
// Link buttons have no padding, so their tap area would only be the text itself.
const LINK_HIT_SLOP = 20;

const TRANSPARENT = { default: "transparent", disable: "transparent" };

const buttonVariants = {
  primary: {
    backgroundColor: tailwind.theme.backgroundColor.info[1],
    borderColor: tailwind.theme.borderColor.brand[1],
    textColor: tailwind.theme.textColor.neutral[10],
    borderWidth: 1,
  },
  white: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[1],
    borderColor: tailwind.theme.borderColor.neutral[7],
    textColor: tailwind.theme.textColor.neutral[1],
    borderWidth: 1,
  },
  black: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[14],
    borderColor: tailwind.theme.borderColor.neutral[3],
    textColor: tailwind.theme.textColor.neutral[10],
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: TRANSPARENT,
    borderColor: TRANSPARENT,
    textColor: tailwind.theme.textColor.neutral[10],
    borderWidth: 0,
  },
  // for links, with no padding, no text direction
  link: {
    backgroundColor: TRANSPARENT,
    borderColor: TRANSPARENT,
    textColor: tailwind.theme.textColor.neutral[10],
    borderWidth: 0,
  },
  // for segments in selectable
  "unselected-segment": {
    backgroundColor: tailwind.theme.backgroundColor.neutral[15],
    borderColor: tailwind.theme.borderColor.neutral[3],
    textColor: tailwind.theme.textColor.neutral[10],
    borderWidth: 2,
  },
  "selected-segment": {
    backgroundColor: tailwind.theme.backgroundColor.neutral[14],
    borderColor: tailwind.theme.borderColor.brand[1],
    textColor: tailwind.theme.textColor.neutral[10],
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

type Props = Omit<PressableProps, "onPress"> & {
  onPress?: () => void;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  haptic?: boolean;
  iconPosition?: "left" | "right" | "only";
  isLoading?: boolean;
  icon?: ReactNode;
  /** Fills the free space in its row, shared equally with other full-width buttons. */
  fullWidth?: boolean;
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
  fullWidth,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [focused, setFocused] = useState(false);
  const textOnly = typeof children === "string" && !!children;
  const iconOnly = iconPosition === "only";

  const animatedOpacity = useDerivedValue(() => {
    return withTiming(focused ? 0.7 : 1, {
      duration: 150,
    });
  });

  const wakeUpScale = useWakeUpScale(props.disabled);
  const colorState = props.disabled ? "disable" : "default";
  const colors = buttonVariants[variant];

  const animatedBg = useDerivedValue(() => {
    return withTiming(colors.backgroundColor[colorState], {
      duration: 150,
    });
  });

  const animatedBorder = useDerivedValue(() => {
    return withTiming(colors.borderColor[colorState], {
      duration: 150,
    });
  });

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
      className={cn(fullWidth && "flex-1", props.className)}
      hitSlop={
        props.hitSlop ?? (variant === "link" ? LINK_HIT_SLOP : undefined)
      }
      onPressIn={(ev) => {
        setFocused(true);
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        setFocused(false);
        props.onPressOut?.(ev);
      }}
      onPress={() => {
        if (haptic) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPress?.();
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
                    color: colors.textColor[colorState],
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
