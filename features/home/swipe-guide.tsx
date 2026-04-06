import { useEffect, useState } from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
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
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";

const SWIPE_GUIDE_LOTTIE_URL =
  "https://meowie-public.s3.eu-central-1.amazonaws.com/swipe-guide-lottie.json";

type Props = {
  currentIndex: number;
};

export const SwipeGuide = ({ currentIndex }: Props) => {
  const homeTourSeen = useAtomValue(homeTourSeenAtom);
  const [swipeGuideSeen, setSwipeGuideSeen] = useAtom(swipeGuideSeenAtom);

  const opacity = useSharedValue(0);

  const isVisible = homeTourSeen && !swipeGuideSeen;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

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
      onLayout={onLayout}
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
      <View className={"absolute z-[-1] h-full w-full"}>
        <Canvas style={{ width: "100%", height: "100%" }}>
          <Rect x={0} y={0} width={dimensions.width} height={dimensions.height}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, dimensions.height)}
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)", "rgba(0,0,0,1)"]}
              positions={[0, 0.35, 1]}
            />
          </Rect>
        </Canvas>
      </View>
    </Animated.View>
  );
};
