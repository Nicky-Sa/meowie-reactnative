import { Screen } from "@/features/auth/providers/otp/verify/screen";
import { KeyboardAvoidingWrapper } from "@/features/common/layout/keyboard-avoiding-wrapper";

export default function VerifyOtpScreen() {
  return (
    <KeyboardAvoidingWrapper>
      <Screen />
    </KeyboardAvoidingWrapper>
  );
}
