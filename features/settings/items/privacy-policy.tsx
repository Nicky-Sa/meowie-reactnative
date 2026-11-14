import { Action } from "@/features/common/ui/action";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import * as WebBrowser from "expo-web-browser";
import { WEBSITE_URL } from "@/lib/consts";

const PRIVACY_POLICY_URL = `${WEBSITE_URL}/privacy`;

export const PrivacyPolicy = () => {
  const handleOpenBrowser = async () => {
    // Opens the in-app browser with the specified URL
    await WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL);
  };
  return (
    <Action onPress={handleOpenBrowser} icon={<Icon i={NavArrowRight} />}>
      Privacy policy
    </Action>
  );
};
