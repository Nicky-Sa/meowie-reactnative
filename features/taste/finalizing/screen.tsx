import { View } from "react-native";
import { Animation } from "@/features/taste/finalizing/elements/animation";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = () => {
  return (
    <SafeAreaView className={"flex flex-1 flex-col justify-between px-4"}>
      <View className={"flex-1 flex-col gap-4"}>
        <Animation />
      </View>
    </SafeAreaView>
  );
};
