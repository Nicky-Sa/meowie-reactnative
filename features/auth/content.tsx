import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IntroText } from "@/features/auth/intro-text";
import { EmailForm } from "@/features/auth/email-form";

export const Content = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className={"flex-1 bg-transparent p-4"}>
        <SafeAreaView>
          <View className={"flex h-full flex-col justify-between p-4"}>
            <IntroText />
            <EmailForm />
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};
