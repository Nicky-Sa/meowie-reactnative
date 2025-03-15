import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn, tailwind } from "@/lib/utils";

export const Button = (props: BottomTabBarButtonProps) => {
  return (
    <PlatformPressable
      {...props}
      onPressIn={async (ev) => {
        if (Platform.OS === "ios") {
          // Add soft haptic feedback when pressing down on the tabs.
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      <LinearGradient
        colors={[
          tailwind.theme.backgroundColor.neutral["1"].default,
          tailwind.theme.backgroundColor.neutral["7"].default,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Number(tailwind.theme.borderRadius.xl),
          borderColor: tailwind.theme.borderColor.neutral["7"].default,
          borderWidth: 1,
        }}
      >
        {typeof props.children === "string" ? (
          <Text className={"text-neutral-1-default body-b1-strong"}>
            {props.children}
          </Text>
        ) : (
          props.children
        )}
      </LinearGradient>
    </PlatformPressable>
  );
};
