import { useLocalSearchParams } from "expo-router";
import { InfoEmail } from "@/features/auth/providers/otp/verify/info-email";
import { OtpForm } from "@/features/auth/providers/otp/verify/otp-form";
import { ScrollView } from "react-native-gesture-handler";
import { InnerScreen } from "@/features/common/layout/inner-screen";

export const Screen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <InnerScreen title={"Verification code"}>
      <ScrollView
        contentContainerClassName={"flex h-full flex-col gap-4"}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
      >
        <InfoEmail email={email} />
        <OtpForm email={email} />
      </ScrollView>
    </InnerScreen>
  );
};
