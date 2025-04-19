import React, { PropsWithChildren, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { tailwind } from "@/lib/utils";

export const MainBg = ({ children }: PropsWithChildren) => {
  const [color] = useAtom(colorAtom);
  const mildColor = color + "80"; // 50% opacity
  const prevColor = useRef(mildColor); // Store the previous color
  const backgroundColor = useSharedValue(prevColor.current); // Initialize with the current color

  useEffect(() => {
    // If the color prop changes, animate from the previous color to the new color
    if (mildColor !== prevColor.current) {
      backgroundColor.value = withTiming(mildColor, {
        duration: 500, // 1 second animation
      });
      prevColor.current = mildColor; // Update the previous color
    }
  }, [backgroundColor, mildColor]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value, // Apply the animated background color
  }));

  return (
    <Animated.View
      style={[
        {
          width: "100%",
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[
          "transparent",
          tailwind.theme.backgroundColor.neutral[13].default,
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.2 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};
