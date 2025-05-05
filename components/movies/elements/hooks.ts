import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useContentScreenSize = () => {
  const insets = useSafeAreaInsets();

  const { height: h, width: w } = useWindowDimensions();
  return {
    height: h + (Platform.select({ android: insets.top, ios: 0 }) ?? 0),
    width: w,
  };
};
