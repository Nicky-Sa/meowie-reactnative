import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "@/features/common/ui/link";
import { useHasUnseenReleaseNote } from "@/features/release-notes/data/use-release-notes-seen";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  useAnimatedProps, // Added import
} from "react-native-reanimated";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import { Tourable } from "@/features/common/ui/tour/tourable";
import { TourStep } from "@/features/common/ui/tour/steps";
import { NotificationBadge } from "@/features/common/ui/notification-badge";

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
  const hasUnseenReleaseNote = useHasUnseenReleaseNote();

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
  }));

  // Controls touch events without forcing a layout recalculation 💡
  const switchAnimatedProps = useAnimatedProps(() => ({
    pointerEvents: (animationValue.value > 0.5 ? "none" : "auto") as
      "none" | "auto",
  }));

  const logoTypeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationValue.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(animationValue.value, [0, 1], [10, 0]) },
    ],
  }));

  return (
    <Animated.View
      className="absolute z-10 flex w-full flex-row items-center px-2"
      style={{
        paddingTop:
          insets.top + Platform.select({ android: 10, ios: 0, default: 0 }),
      }}
    >
      <View className="flex-1 items-start">
        <Link href="/release-notes">
          <View className="relative">
            <Logo />
            {hasUnseenReleaseNote && (
              <NotificationBadge className={"right-0.5 top-0.5"} />
            )}
          </View>
        </Link>
      </View>

      <View className="relative items-center justify-center">
        {/* Toggle */}
        <Animated.View style={switchStyle} animatedProps={switchAnimatedProps}>
          <Tourable
            tour={{
              step: TourStep.HeaderToggle,
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
          pointerEvents="none" // Hardcoded to none to prevent it from stealing clicks when invisible
        >
          <LogoType />
        </Animated.View>
      </View>

      {/* Balances the logo so the toggle stays centered on screen */}
      <View className="flex-1" />
    </Animated.View>
  );
};
