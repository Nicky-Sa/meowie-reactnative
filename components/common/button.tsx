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
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
  },
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["8"]),
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["3"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["2"]),
    paddingHorizontal: Number(tailwind.theme.spacing["3"]),
  },
  unset: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
};

type Props = BottomTabBarButtonProps & {
  haptic?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  square?: boolean;
};

export const Button = ({
  variant = "primary",
  size = "lg",
  square = false,
  haptic = true,
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
            paddingHorizontal: square
              ? sizes[size].paddingVertical
              : sizes[size].paddingHorizontal,
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
  );
};
