import { Text, View } from "react-native";
import { EmailForm } from "@/features/auth/providers/otp/request/email-form";
import { ScrollView } from "react-native-gesture-handler";
import { InnerScreen } from "@/features/common/layout/inner-screen";

export const Screen = () => {
  return (
    <View className="flex-1 bg-neutral-15-default">
      <InnerScreen title="Enter your email">
        <ScrollView
          contentContainerClassName="flex flex-1 flex-col justify-between"
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex flex-1 flex-col justify-start gap-4">
            <Text className={"body-b2 text-neutral-10-default"}>
              We’ll email you a code to verify your account.
            </Text>
            <EmailForm />
          </View>
        </ScrollView>
      </InnerScreen>
    </View>
  );
};
