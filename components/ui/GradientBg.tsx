import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Dimensions } from "react-native";

type Props = {
  colors: [string, string, ...string[]];
  scrollY: SharedValue<number>;
  index: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");


export const GradientBg = ({
  children,
  colors,
  scrollY,
  index,
}: PropsWithChildren<Props>) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_HEIGHT,
      index * SCREEN_HEIGHT,
      (index + 1) * SCREEN_HEIGHT,
    ];

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0, 1, 0], // Fade out as you scroll away
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={colors}
        className={"h-full w-full flex-1 bg-primary-100"}
        locations={[0.5, 1]}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};
