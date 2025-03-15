import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
        colors={["#FAFAFA", "#BEBEBE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          borderColor: "red",
          borderWidth: 1,
        }}
      >
        <Text className={"text-default"}>{props.children}</Text>
      </LinearGradient>
    </PlatformPressable>
  );
};
