import { View } from "react-native";
import { Link } from "@/features/common/ui/link";
import { useReleaseNotesSeen } from "@/features/release-notes/data/use-release-notes-seen";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useAnimatedProps,
} from "react-native-reanimated";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import { Tourable } from "@/features/common/ui/tour/tourable";
import { TourStep } from "@/features/common/ui/tour/steps";
import { NotificationBadge } from "@/features/common/ui/notification-badge";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useScrollDownProgress } from "@/features/common/hooks/list/use-scroll-down-progress";
import { HeaderContainer } from "@/features/common/layout/header-container";

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
  const hasUnseenReleaseNote = useReleaseNotesSeen();
  const { interaction } = useAnalytics();

  // 0 = Show Toggle, 1 = Show LogoType
  const { progress: animationValue } = useScrollDownProgress({ scrollY });

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
    <HeaderContainer className="absolute z-10">
      <View className="flex-1 items-start">
        <Link
          href="/release-notes"
          onPress={() =>
            interaction.trackReleaseNotesOpened({
              hasNewNote: hasUnseenReleaseNote,
            })
          }
        >
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
          <Tourable step={TourStep.HeaderToggle}>
            <SlidingToggle
              containerClassName={"w-44"}
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
    </HeaderContainer>
  );
};
