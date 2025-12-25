import { KeyboardAvoidingWrapper } from "@/features/common/layout/keyboard-avoiding-wrapper";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <KeyboardAvoidingWrapper>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="request-otp" />
        <Stack.Screen name="verify-otp" />
      </Stack>
    </KeyboardAvoidingWrapper>
  );
}
