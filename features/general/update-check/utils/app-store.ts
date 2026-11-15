import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";
import { getErrorText } from "@/features/common/data/error";
import { APP_STORE_URL } from "@/lib/consts";

export const openAppStore = async () => {
  try {
    await Linking.openURL(APP_STORE_URL);
  } catch (error) {
    console.error("Couldn't open the App Store:", error);
    Toast.show({
      type: "error",
      text1: "Couldn't open the App Store",
      text2: getErrorText(error),
    });
  }
};
