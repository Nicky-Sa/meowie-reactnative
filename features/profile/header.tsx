import { ComponentProps } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated from "react-native-reanimated";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import { ProfileHeaderButton } from "@/features/profile/header-button";
import { HeaderContainer } from "@/features/common/layout/header-container";

type Props = {
  onLayout: (event: LayoutChangeEvent) => void;
  style: ComponentProps<typeof Animated.View>["style"];
};

export const Header = ({ onLayout, style }: Props) => {
  return (
    <Animated.View style={style} onLayout={onLayout}>
      <HeaderContainer className="pb-4">
        <Logo />
        <LogoType />
        <View className={"relative"}>
          <ProfileHeaderButton />
        </View>
      </HeaderContainer>
    </Animated.View>
  );
};
