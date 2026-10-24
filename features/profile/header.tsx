import { ComponentProps } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated from "react-native-reanimated";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import { ProfileHeaderButton } from "@/features/profile/header-button";
import { useSafeHeaderTopPadding } from "@/features/common/hooks/use-safe-header-top-padding";

type Props = {
  onLayout: (event: LayoutChangeEvent) => void;
  style: ComponentProps<typeof Animated.View>["style"];
};

export const Header = ({ onLayout, style }: Props) => {
  const safeHeaderTopPadding = useSafeHeaderTopPadding();

  return (
    <Animated.View style={style} onLayout={onLayout}>
      <View
        className="flex w-full flex-row items-center justify-between px-2 pb-4"
        style={{
          paddingTop: safeHeaderTopPadding,
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
