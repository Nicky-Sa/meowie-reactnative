import { Action } from "@/features/common/ui/action";
import { Text, View } from "react-native";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { useRouter } from "expo-router";

export const DeleteAccount = () => {
  const router = useRouter();
  return (
    <Action onPress={() => router.push("/settings/delete-account")}>
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="body-b1-strong text-neutral-10-default">
          Delete Account
        </Text>
        <Icon i={NavArrowRight} />
      </View>
    </Action>
  );
};
