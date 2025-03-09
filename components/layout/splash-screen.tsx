import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Rive, { Alignment } from "rive-react-native";

type Props = {
  isLoading: boolean;
};

export const SplashScreen = ({ isLoading }: Props) => {
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
    }, 2000); // Minimum time for splash screen

    return () => clearTimeout(timeout);
  }, [fadeOutAnim, isLoading]); // Re-run the effect when isLoading changes

  const splashStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOutAnim.value, // Bind fadeOutAnim to opacity for splash screen
      display: fadeOutAnim.value === 0 ? "none" : "flex",
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", zIndex: 10, width: "100%", height: "100%" },
        splashStyle,
      ]}
    >
      <View className={"h-full w-full bg-primary-200"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/Meowie-splash.riv"
          alignment={Alignment.Center}
        />
      </View>
    </Animated.View>
  );
};
