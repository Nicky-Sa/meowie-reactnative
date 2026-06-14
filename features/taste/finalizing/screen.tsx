import { Text, View } from "react-native";
import { Animation } from "@/features/taste/finalizing/elements/animation";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = () => {
  return (
    <SafeAreaView className={"flex flex-1 flex-col justify-between px-4"}>
      <View className={"my-14 flex-1 flex-col gap-4"}>
        <View className={"flex flex-col gap-2"}>
          <Text
            className={"title-t3-strong text-center text-neutral-10-default"}
          >
            Congratulation!
          </Text>
          <Text className={"body-b2 text-center text-neutral-5-default"}>
            We’ve received your taste!
          </Text>
        </View>
        <Animation />
      </View>
    </SafeAreaView>
  );
};
