import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";
import { ProfileHeaderButton } from "@/features/profile/header-button";

type Props = {
  scrollY: SharedValue<number>;
};

export const Header = ({ scrollY }: Props) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const targetColor = tailwind.theme.backgroundColor.neutral[15].default;

    const backgroundColor = interpolateColor(
      scrollY.value,
      [20, 100],
      ["transparent", targetColor],
    );

    return { backgroundColor };
  });

  return (
    <Animated.View
      className={
        "absolute z-10 flex w-full flex-1 flex-row items-center justify-between px-2"
      }
      style={[
        animatedStyle,
        {
          paddingTop:
            insets.top + Platform.select({ android: 10, ios: 0, default: 0 }),
        },
      ]}
    >
      <Logo />
      <LogoType />
      <View className={"relative"}>
        <ProfileHeaderButton />
      </View>
    </Animated.View>
  );
};
