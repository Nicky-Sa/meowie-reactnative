import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

type Props = {
  isLoading?: boolean;
  onFinish?: () => void;
};

export const SplashScreen = ({ isLoading, onFinish }: Props) => {
  const fadeOutAnim = useSharedValue(1); // Controls splash fade-out

  useEffect(() => {
    // Show splash for at least 2 seconds
    const timeout = setTimeout(() => {
      if (!isLoading) {
        fadeOutAnim.value = withTiming(0, {
          duration: 400,
          easing: Easing.ease,
        }); // Fade out splash screen
      }
      onFinish?.();
    }, 2000); // Minimum time for splash screen

    return () => clearTimeout(timeout);
  }, [fadeOutAnim, isLoading, onFinish]); // Re-run the effect when isLoading changes

  const splashStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOutAnim.value, // Bind fadeOutAnim to opacity for splash screen
      display: fadeOutAnim.value === 0 ? "none" : "flex",
    };
  });

  return (
    <Animated.View
      style={[{ position: "absolute", zIndex: 10 }, splashStyle]}
      className={"flex h-full w-full flex-col items-center justify-center"}
    >
      <LottieView
        source={require("@/assets/lottie/splash.json")}
        autoPlay
        loop={false}
        resizeMode={"contain"}
        style={{
          alignSelf: "center",
          width: "50%",
          height: "50%",
        }}
      />
    </Animated.View>
  );
};
