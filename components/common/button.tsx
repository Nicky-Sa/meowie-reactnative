import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { tailwind } from "@/lib/utils";

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
  const styles = {
    borderRadius: sizes[size].borderRadius,
    borderWidth: 1,
    borderColor: variants[variant].borderColor,
  };

  return (
    <Pressable
      {...props}
      onPressIn={async (ev) => {
        if (haptic) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      <View
        style={{
          ...(Platform.OS === "android" && styles),
          overflow: "hidden",
        }}
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
            // alignItems: "center",
            // justifyContent: "center",
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
      </View>
    </Pressable>
  );
};
