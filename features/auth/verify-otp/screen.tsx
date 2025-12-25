import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/features/auth/verify-otp/header";
import { InfoEmail } from "@/features/auth/verify-otp/info-email";
import { OtpForm } from "@/features/auth/verify-otp/otp-form";
import { ScrollView } from "react-native-gesture-handler";

export const Screen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const handleBack = () => {
    router.back();
  };
  return (
    <View className={"flex-1 p-4"}>
      <SafeAreaView>
        <ScrollView
          contentContainerClassName={"flex h-full flex-col gap-4"}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header handleBack={handleBack} />
          <InfoEmail email={email} handleBack={handleBack} />
          <OtpForm email={email} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
