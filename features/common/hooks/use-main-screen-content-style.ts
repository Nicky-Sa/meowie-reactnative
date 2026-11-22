import { useContext } from "react";
import { BottomTabBarHeightContext } from "expo-router/js-tabs";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Args = {
  headerHeight?: number;
};

/**
 * For the style of main screens with header and navbar
 */
export const useMainScreenContentStyle = ({
  headerHeight = 56, // 56 is the typical header height
}: Args = {}) => {
  const { height } = useScreenDimensions();
  const { top, bottom } = useSafeAreaInsets();
  // Only screens inside the tab navigator get a value from this context
  const hasNavbar = useContext(BottomTabBarHeightContext) !== undefined;
  const extraPaddingTop = headerHeight;
  // The navbar is 70pt tall and sits 28pt above the bottom edge on every phone, whatever the safe area
  const paddingBottom = hasNavbar ? 98 : bottom;

  return {
    height,
    paddingTop: top + extraPaddingTop,
    paddingBottom,
  };
};

/**
 * Height of the space between the header and the navbar
 */
export const useMainScreenContentHeight = () => {
  const { height, paddingTop, paddingBottom } = useMainScreenContentStyle();
  return height - paddingTop - paddingBottom;
};
