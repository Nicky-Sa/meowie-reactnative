import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { scheduleOnRN } from "react-native-worklets";
import splashAnimation from "@/assets/lottie/splash-lottie.json";

type Props = {
  isLoading: boolean;
  onFinish: () => void;
};

export const SplashScreen = ({ isLoading, onFinish }: Props) => {
  const fadeOutAnim = useSharedValue(1); // Controls splash fade-out
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // 1. Run the minimum timer ONLY once on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []); // Empty dependency array prevents timer resets

  // 2. Trigger the fade-out when both conditions are met
  useEffect(() => {
    if (minTimeElapsed && !isLoading) {
      fadeOutAnim.value = withTiming(
        0,
        {
          duration: 400,
          easing: Easing.ease,
        },
        (isFinished) => {
          // Wait for the animation to complete before triggering onFinish
          if (isFinished) {
            scheduleOnRN(onFinish);
          }
        },
      );
    }
  }, [minTimeElapsed, isLoading, fadeOutAnim, onFinish]);

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
        source={splashAnimation}
        autoPlay
        loop={false}
        resizeMode={"contain"}
        style={{
          alignSelf: "center",
          width: "35%",
          height: "35%",
        }}
      />
    </Animated.View>
  );
};
