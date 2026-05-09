import { Icon } from "@/features/common/ui/icon";
import Logo from "@/assets/images/logo/logo.svg";
import { Text, View } from "react-native";

export const IntroText = () => {
  return (
    <View className={"flex flex-col gap-1"}>
      <Icon i={Logo} width={64} height={64} />
      <View className={"flex flex-row items-center gap-2"}>
        <Text
          className={"headline-h5-mazius leading-none text-neutral-10-default"}
        >
          Welcome to Meowie
        </Text>
      </View>
      <Text className={"title-t2 text-neutral-5-default"}>Login / Signup</Text>
    </View>
  );
};
