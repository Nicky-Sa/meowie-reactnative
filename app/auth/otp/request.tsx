import { Screen } from "@/features/auth/providers/otp/request/screen";
import { KeyboardAvoidingWrapper } from "@/features/common/layout/keyboard-avoiding-wrapper";

export default function RequestOtpScreen() {
  return (
    <KeyboardAvoidingWrapper>
      <Screen />
    </KeyboardAvoidingWrapper>
  );
}
