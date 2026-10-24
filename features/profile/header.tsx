import { ComponentProps } from "react";
import { LayoutChangeEvent, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import { ProfileHeaderButton } from "@/features/profile/header-button";

type Props = {
  onLayout: (event: LayoutChangeEvent) => void;
  style: ComponentProps<typeof Animated.View>["style"];
};

export const Header = ({ onLayout, style }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View style={style} onLayout={onLayout}>
      <View
        className="flex w-full flex-row items-center justify-between px-2 pb-4"
        style={{
          paddingTop:
            insets.top + Platform.select({ android: 10, ios: 0, default: 0 }),
        }}
      >
        <Logo />
        <LogoType />
        <View className={"relative"}>
          <ProfileHeaderButton />
        </View>
      </View>
    </Animated.View>
  );
};
