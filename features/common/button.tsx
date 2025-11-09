import * as Haptics from "expo-haptics";
import { Pressable, PressableProps, Text, View } from "react-native";
import { cn, tailwind } from "@/lib/utils";
import { PropsWithChildren, useState } from "react";
import LottieView from "lottie-react-native";

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
  // for links, with no padding
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
    paddingHorizontal: Number(tailwind.theme.spacing["8"]),
    iconOffset: 8,
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
  iconOnly?: boolean;
  haptic?: boolean;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
};

export const Button = ({
  variant = "primary",
  size = "lg",
  iconOnly = false,
  haptic = true,
  iconPosition,
  isLoading,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [focused, setFocused] = useState(false);
  const isTextOnly = typeof children === "string";

  return (
    <Pressable
      {...props}
      onPressIn={async (ev) => {
        setFocused(true);
        if (haptic) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        setFocused(false);
        props.onPressOut?.(ev);
      }}
      disabled={props.disabled || isLoading}
    >
      <View
        className={cn("overflow-hidden", focused && "opacity-50")}
        style={{
          opacity: props.disabled ? 0.5 : 1,
          backgroundColor: buttonVariants[variant].backgroundColor,
          borderRadius: variant !== "link" ? buttonSizes[size].borderRadius : 0,
          borderWidth: buttonVariants[variant].borderWidth,
          borderColor: buttonVariants[variant].borderColor,
          paddingVertical:
            variant !== "link" ? buttonSizes[size].paddingVertical : 0,
          paddingRight:
            variant !== "link"
              ? iconOnly
                ? buttonSizes[size].paddingVertical
                : iconPosition === "right"
                  ? buttonSizes[size].paddingHorizontal -
                    buttonSizes[size].iconOffset
                  : buttonSizes[size].paddingHorizontal
              : 0,
          paddingLeft:
            variant !== "link"
              ? iconOnly
                ? buttonSizes[size].paddingVertical
                : iconPosition === "left"
                  ? buttonSizes[size].paddingHorizontal -
                    buttonSizes[size].iconOffset
                  : buttonSizes[size].paddingHorizontal
              : 0,
          ...(props.style as object),
        }}
      >
        {isLoading ? (
          <View className={cn(props.className)}>
            <LottieView
              source={{
                uri: "https://lottie.host/099429f0-1128-4b7b-9e48-562fb873b761/eQhxLE6Pc5.lottie",
              }}
              autoPlay
              loop
              resizeMode={"cover"}
              style={{ alignSelf: "center", width: 48, height: 20 }}
            />
          </View>
        ) : isTextOnly ? (
          <Text
            style={{ color: buttonVariants[variant].textColor }}
            className={cn(
              {
                "text-center": variant !== "link",
                "body-b1-strong": size === "lg",
                "body-b2-strong": size === "md",
                "caption-c1-strong": size === "sm",
              },
              props.className,
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
};
