import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSafeHeaderTopPadding = () => {
  const { top } = useSafeAreaInsets();
  return top + Platform.select({ android: 10, ios: 0, default: 0 });
};
