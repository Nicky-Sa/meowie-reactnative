import { View } from "react-native";
import { Icon } from "@/features/common/ui/icon";
import Logo from "@/assets/images/logo/logo.svg";
import { SkipAuth } from "@/features/auth/components/skip-auth";

export const Header = () => {
  return (
    <View className={"flex flex-row items-center justify-between"}>
      <Icon i={Logo} width={48} height={48} />
      <SkipAuth />
    </View>
  );
};
