import { useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

type Props = { progress: number };

export const Animation = ({ progress }: Props) => {
  // Drive Lottie's frame from a shared value so changes scrub smoothly
  // on the UI thread instead of jumping to the target frame.
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 600,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    progress: animatedProgress.value,
  }));

  return (
    <View className="flex-1">
      <AnimatedLottieView
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/taste-flexibility.json?v=2",
        }}
        resizeMode={"contain"}
        loop={false}
        autoPlay={false}
        animatedProps={animatedProps}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
};
