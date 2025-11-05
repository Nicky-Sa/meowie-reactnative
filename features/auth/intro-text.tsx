import { Icon } from "@/features/common/icon";
import Logo from "@/assets/images/logo/logo.svg";
import { Text, View } from "react-native";
import LogoType from "@/assets/images/logo/logo-type.svg";

export const IntroText = () => {
  return (
    <View className={"flex flex-col gap-1"}>
      <Icon i={Logo} width={64} height={64} />
      <View className={"flex flex-row items-center gap-2"}>
        <Text className={"headline-h5 leading-none text-neutral-10-default"}>
          Welcome to
        </Text>
        <Icon i={LogoType} width={85} height={20} />
      </View>
      <Text className={"title-t2 text-neutral-5-default"}>Login / Signup</Text>
    </View>
  );
};
