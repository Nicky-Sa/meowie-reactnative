import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";
import { ReactNode } from "react";

type Props = {
  headerButton: ReactNode;
};

export const Header = ({ headerButton }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={
        "absolute z-10 flex w-full flex-1 flex-row items-center justify-between px-4"
      }
      style={{
        marginTop:
          insets.top + Platform.select({ android: 10, ios: 2, default: 0 }),
      }}
    >
      <Logo />
      <LogoType />
      <View className={"relative"}>{headerButton}</View>
    </View>
  );
};
