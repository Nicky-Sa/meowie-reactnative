import { Icon } from "@/features/common/ui/icon";
import { NavArrowRight } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { Action } from "@/features/common/ui/action";
import { Text, View } from "react-native";

export const Feedback = () => {
  const router = useRouter();

  return (
    <Action onPress={() => router.push("/settings/feedback")}>
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="body-b1-strong text-neutral-10-default">
          Send Feedback
        </Text>
        <Icon i={NavArrowRight} />
      </View>
    </Action>
  );
};
