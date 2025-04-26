import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn, tailwind } from "@/lib/utils";
import { useState } from "react";

const variants = {
  primary: {
    backgroundColor: [
      tailwind.theme.backgroundColor.neutral["1"].default,
      tailwind.theme.backgroundColor.neutral["7"].default,
    ],
    borderColor: tailwind.theme.borderColor.neutral["7"].default,
  },
  secondary: {
    backgroundColor: [
      tailwind.theme.backgroundColor.neutral[11].default,
      tailwind.theme.backgroundColor.neutral[12].default,
    ],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
  },
  ghost: {
    backgroundColor: ["transparent", "transparent"],
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: ["transparent", "transparent"],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
  },
} as const;

const sizes = {
  full: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingRight: Number(tailwind.theme.spacing["4"]),
    paddingLeft: Number(tailwind.theme.spacing["4"]),
    iconOffset: 8,
  },
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingRight: Number(tailwind.theme.spacing["8"]),
    paddingLeft: Number(tailwind.theme.spacing["8"]),
    iconOffset: 8,
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["3"]),
    paddingRight: Number(tailwind.theme.spacing["6"]),
    paddingLeft: Number(tailwind.theme.spacing["6"]),
    iconOffset: 8,
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["2"]),
    paddingRight: Number(tailwind.theme.spacing["3"]),
    paddingLeft: Number(tailwind.theme.spacing["3"]),
    iconOffset: 4,
  },
  unset: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingRight: 0,
    paddingLeft: 0,
    iconOffset: 0,
  },
};

type Props = BottomTabBarButtonProps & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  square?: boolean;
  haptic?: boolean;
  iconPosition?: "left" | "right";
  hasIndicator?: boolean;
};

export const Button = ({
  variant = "primary",
  size = "lg",
  square = false,
  haptic = true,
  iconPosition,
  hasIndicator,
  children,
  ...props
}: Props) => {
  const [focused, setFocused] = useState(false);

  const styles = {
    borderRadius: sizes[size].borderRadius,
    borderWidth: 1,
    borderColor: variants[variant].borderColor,
    ...(props.style as object),
  };

  return (
    <View>
      <Pressable
        {...props}
        onPressIn={async (ev) => {
          setFocused(true);
          if (haptic) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
        onPressOut={() => setFocused(false)}
      >
        <View
          style={{
            ...(Platform.OS === "android" && styles),
            overflow: "hidden",
          }}
          className={cn(
            focused && "opacity-50",
            props.className,
            size === "full" && "w-full",
          )}
        >
          <LinearGradient
            colors={variants[variant].backgroundColor}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              ...(Platform.OS === "ios" && styles),
              paddingVertical: sizes[size].paddingVertical,
              paddingRight: square
                ? sizes[size].paddingVertical
                : iconPosition === "right"
                  ? sizes[size].paddingRight - sizes[size].iconOffset
                  : sizes[size].paddingRight,
              paddingLeft: square
                ? sizes[size].paddingVertical
                : iconPosition === "left"
                  ? sizes[size].paddingLeft - sizes[size].iconOffset
                  : sizes[size].paddingLeft,
            }}
          >
            {typeof children === "string" ? (
              <Text
                className={cn(
                  "body-b1-strong text-neutral-1-default",
                  props.className,
                )}
              >
                {children}
              </Text>
            ) : (
              children
            )}
          </LinearGradient>
        </View>
      </Pressable>
      {hasIndicator && (
        <View
          className={
            "absolute left-0 top-0 h-2.5 w-2.5 rounded-full border-1.5 border-neutral-10-default bg-red-700"
          }
        />
      )}
    </View>
  );
};
