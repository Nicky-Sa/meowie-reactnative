import { useEffect } from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useAtom, useAtomValue } from "jotai";
import { homeTourSeenAtom, swipeGuideSeenAtom } from "@/atoms";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";

const SWIPE_GUIDE_LOTTIE_URL =
  "https://meowie-public.s3.eu-central-1.amazonaws.com/swipe-guide-lottie.json?v=1";

type Props = {
  currentIndex: number;
};

export const SwipeGuide = ({ currentIndex }: Props) => {
  const homeTourSeen = useAtomValue(homeTourSeenAtom);
  const [swipeGuideSeen, setSwipeGuideSeen] = useAtom(swipeGuideSeenAtom);

  const opacity = useSharedValue(0);

  const isVisible = homeTourSeen && !swipeGuideSeen;

  // Fade in after tour completes
  useEffect(() => {
    if (isVisible) {
      opacity.value = withDelay(
        500,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
      );
    }
  }, [isVisible, opacity]);

  // Hide permanently on first scroll
  useEffect(() => {
    if (currentIndex > 0 && isVisible) {
      opacity.value = withTiming(0, { duration: 300 }, () => {});
      setSwipeGuideSeen(true);
    }
  }, [currentIndex, isVisible, opacity, setSwipeGuideSeen]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={animatedStyle}
      className="absolute bottom-0 left-0 right-0 h-1/3 items-center justify-end"
    >
      <View className="mb-40 flex flex-col items-center">
        <View className="h-24 w-24">
          <LottieView
            source={{ uri: SWIPE_GUIDE_LOTTIE_URL }}
            autoPlay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text className="body-b1 text-neutral-10-default">
          Swipe to navigate
        </Text>
      </View>
      <GradientOverlay
        height={"100%"}
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)", "rgba(0,0,0,1)"]}
        positions={[0, 0.35, 1]}
        className={"absolute z-[-1]"}
      />
    </Animated.View>
  );
};
