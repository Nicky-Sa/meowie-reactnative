import { Action } from "@/features/common/action";
import { Text, View } from "react-native";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/icon";
import * as WebBrowser from "expo-web-browser";

export const PrivacyPolicy = () => {
  const handleOpenBrowser = async () => {
    // Opens the in-app browser with the specified URL
    await WebBrowser.openBrowserAsync("https://meowie.app/privacy");
  };
  return (
    <Action onPress={handleOpenBrowser}>
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="body-b1-strong text-neutral-10-default">
          Privacy Policy
        </Text>
        <Icon i={NavArrowRight} />
      </View>
    </Action>
  );
};
