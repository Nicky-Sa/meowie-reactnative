import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
} from "react-native-reanimated";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import { SortHeaderButton } from "@/features/sort/header-button";
import { Tourable } from "@/features/common/ui/tour/Tourable";
import { TourStep } from "@/features/common/ui/tour/steps";

type Props = {
  scrollY: SharedValue<number>;
  mediaTypes: string[];
  activeMediaType: string;
  setActiveMediaType: (item: string) => void;
};

export const Header = ({
  scrollY,
  mediaTypes,
  activeMediaType,
  setActiveMediaType,
}: Props) => {
  const insets = useSafeAreaInsets();

  // 0 = Show Toggle, 1 = Show LogoType
  const animationValue = useSharedValue(0);
  // We use this "Target" to lock the logic so we don't re-trigger animations unnecessarily
  const targetState = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (current, previous) => {
      if (previous === null) return;
      const diff = current - previous;

      // Rule 1: Always show Toggle (0) if we are at the very top
      if (current < 10 && targetState.value !== 0) {
        targetState.value = 0;
        animationValue.value = withTiming(0, { duration: 200 });
        return;
      }

      // Rule 2: Scrolling Down -> Switch to LogoType (1)
      // We add a threshold (diff > 2) to ignore tiny accidental movements
      if (diff > 2 && current > 50 && targetState.value !== 1) {
        targetState.value = 1;
        animationValue.value = withTiming(1, { duration: 300 });
      }

      // Rule 3: Scrolling Up -> Switch to Toggle (0)
      if (diff < -2 && targetState.value !== 0) {
        targetState.value = 0;
        animationValue.value = withTiming(0, { duration: 300 });
      }
    },
  );

  const switchStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationValue.value, [0, 1], [1, 0]),
    transform: [
      { translateY: interpolate(animationValue.value, [0, 1], [0, -10]) },
    ],
    // Hides the element from the accessibility tree and touch events when invisible
    display: animationValue.value > 0.9 ? "none" : "flex",
  }));

  const logoTypeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationValue.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(animationValue.value, [0, 1], [10, 0]) },
    ],
  }));

  return (
    <Animated.View
      className="absolute z-10 flex w-full flex-row items-center justify-between px-2"
      style={{
        paddingTop:
          insets.top + Platform.select({ android: 10, ios: 0, default: 0 }),
      }}
    >
      <Logo />

      <View className="relative items-center justify-center">
        {/* Toggle */}
        <Animated.View style={switchStyle}>
          <Tourable
            tour={{
              step: TourStep.HeaderToggle,
              text: "Switch between Movies and TV shows here.",
              shape: "rectangle",
              borderRadius: 28,
            }}
          >
            <SlidingToggle
              containerClassName={"h-14 w-44"}
              items={mediaTypes}
              activeItem={activeMediaType}
              setActiveItem={setActiveMediaType}
            />
          </Tourable>
        </Animated.View>

        {/* LogoType */}
        <Animated.View
          className="absolute inset-0 items-center justify-center"
          style={logoTypeStyle}
        >
          <LogoType />
        </Animated.View>
      </View>

      <View className="relative">
        <Tourable
          tour={{
            step: TourStep.HeaderSort,
            text: "Sort content by date or popularity.",
            shape: "circle",
          }}
        >
          <SortHeaderButton />
        </Tourable>
      </View>
    </Animated.View>
  );
};
