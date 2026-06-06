import { Action } from "@/features/common/ui/action";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import * as WebBrowser from "expo-web-browser";

export const PrivacyPolicy = () => {
  const handleOpenBrowser = async () => {
    // Opens the in-app browser with the specified URL
    await WebBrowser.openBrowserAsync("https://meowie.app/privacy");
  };
  return (
    <Action onPress={handleOpenBrowser} icon={<Icon i={NavArrowRight} />}>
      Privacy policy
    </Action>
  );
};
