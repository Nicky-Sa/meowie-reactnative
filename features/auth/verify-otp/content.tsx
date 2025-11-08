import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/features/auth/verify-otp/header";
import { InfoEmail } from "@/features/auth/verify-otp/info-email";

export const Content = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const handleBack = () => {
    router.back();
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className={"flex-1 bg-neutral-15-default p-4"}>
        <SafeAreaView>
          <View className={"flex h-full flex-col gap-4"}>
            <Header handleBack={handleBack} />
            <InfoEmail email={email} handleBack={handleBack} />
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};
