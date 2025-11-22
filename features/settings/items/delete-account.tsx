import { Action } from "@/features/common/action";
import { Text, View } from "react-native";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/icon";

export const DeleteAccount = () => {
  return (
    <Action onPress={() => {}}>
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="body-b1-strong text-neutral-10-default">
          Delete Account
        </Text>
        <Icon i={NavArrowRight} />
      </View>
    </Action>
  );
};
