import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * For the style of main screens with header and navbar
 */
export const useMainContentStyle = () => {
  const { height } = useScreenDimensions();
  const { top, bottom } = useSafeAreaInsets();

  return {
    height,
    paddingTop: top + 80, // 80 is to account for the header
    paddingBottom: bottom + 90, // 90 is to account for the navbar
  };
};
