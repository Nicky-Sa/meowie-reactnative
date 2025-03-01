import React, { PropsWithChildren, useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View } from "react-native";
import { ColoredEllipse } from "@/components/ui/ColoredEllipse";

type Props = {
  color: string;
};

export const MainBg = ({ children, color }: PropsWithChildren<Props>) => {
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
    // <Animated.View style={[animatedStyle]}>
    <View className={"bg-primary-200 relative h-full w-full flex-1"}>
      <View className={"absolute -top-40 flex h-full w-full items-center"}>
        <ColoredEllipse color={color} />
      </View>
      {children}
    </View>
    // </Animated.View>
  );
};
