import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Args = Partial<{
  hasHeader: boolean;
  hasNavbar: boolean;
}>;

/**
 * For the style of main screens with header and navbar
 */
export const useMainScreenContentStyle = ({
  hasHeader = true,
  hasNavbar = true,
}: Args = {}) => {
  const { height } = useScreenDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const extraPaddingTop = hasHeader ? 80 : 20; // 80 is to account for the header, 20 is to account for the safe area top in case there is no header
  const extraPaddingBottom = hasNavbar ? 90 : 0; // 90 is to account for the navbar

  return {
    height,
    paddingTop: top + extraPaddingTop,
    paddingBottom: bottom + extraPaddingBottom,
  };
};
