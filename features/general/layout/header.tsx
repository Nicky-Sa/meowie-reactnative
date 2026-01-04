import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import { ReactNode } from "react";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";

type Props = {
  headerButton: ReactNode;
  scrollY?: SharedValue<number>;
};

export const Header = ({ headerButton, scrollY }: Props) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    // Default to solid black if scrollY is not defined
    if (!scrollY) return { backgroundColor: "transparent" };

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
      <View className={"relative"}>{headerButton}</View>
    </Animated.View>
  );
};
