import React, { PropsWithChildren, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  color: string;
};

export const GradientBg = ({ children, color }: PropsWithChildren<Props>) => {
  const prevColor = useRef(color); // Store the previous color
  const backgroundColor = useSharedValue(prevColor.current); // Initialize with the current color

  useEffect(() => {
    // If the color prop changes, animate from the previous color to the new color
    if (color !== prevColor.current) {
      backgroundColor.value = withTiming(color, {
        duration: 1000, // 1 second animation
      });
      prevColor.current = color; // Update the previous color
    }
  }, [color]);


  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value, // Apply the animated background color
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <LinearGradient
        colors={["transparent", "#000000"]}
        className={"h-full w-full flex-1"}
        locations={[0.2, 1]}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};
