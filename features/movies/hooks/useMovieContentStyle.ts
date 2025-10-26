import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useMovieContentStyle = () => {
  const { height } = useScreenDimensions();
  const { top } = useSafeAreaInsets();

  return {
    height,
    paddingTop: top + 80, // 80 is to account for the header
  };
};
