import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn, tailwind } from "@/lib/utils";

type Props = BottomTabBarButtonProps & {
  haptic?: boolean;
  variant?: "primary" | "secondary";
  size?: "full" | "lg" | "md" | "sm";
  square?: boolean;
};

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
};

export const Button = ({
  variant = "primary",
  size = "lg",
  square = false,
  children,
  ...props
}: Props) => {
  return (
    <PlatformPressable
      {...props}
      onPressIn={async (ev) => {
        if (Platform.OS === "ios" && props.haptic) {
          // Add soft haptic feedback when pressing down on the tabs.
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      <LinearGradient
        colors={variants[variant].backgroundColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: sizes[size].paddingVertical,
          paddingHorizontal: square
            ? sizes[size].paddingVertical
            : sizes[size].paddingHorizontal,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: sizes[size].borderRadius,
          borderColor: variants[variant].borderColor,
          borderWidth: 1,
        }}
      >
        {typeof children === "string" ? (
          <Text className={"body-b1-strong text-neutral-1-default"}>
            {children}
          </Text>
        ) : (
          children
        )}
      </LinearGradient>
    </PlatformPressable>
  );
};
