import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { PropsWithChildren, useState } from "react";

type Props = {
  scrollY: SharedValue<number>;
};

const SCROLL_START = 20;
const SCROLL_END = 300;

export const TabHeader = ({ scrollY, children }: PropsWithChildren<Props>) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  const animatedStyle = useAnimatedStyle(() => {
    // If we haven't measured the header yet, don't animate
    if (headerHeight === 0) return {};

    return {
      height: interpolate(
        scrollY.value,
        [SCROLL_START, SCROLL_END],
        [headerHeight, 80], // 80 is here to make sure the tabs don't go under the main header
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        scrollY.value,
        [SCROLL_START, SCROLL_END],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      // Slide up effect
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [SCROLL_START, SCROLL_END],
            [0, -20],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    // Only set height once to avoid loops, unless dynamic resizing is needed
    if (headerHeight === 0) {
      setHeaderHeight(event.nativeEvent.layout.height);
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      {/* We wrap the content in a View to measure it.
        This internal view maintains its layout integrity while the
        parent Animated.View clips the height.
        The main styling of the children should be done on the children themselves.
      */}
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
};
