import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useMoviesScreenHeight = () => {
  const insets = useSafeAreaInsets();

  const { height: h } = useWindowDimensions();
  return h + (Platform.select({ android: insets.top, ios: 0 }) ?? 0);
};
