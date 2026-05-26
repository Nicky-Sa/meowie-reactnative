import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleAuth } from "@/features/auth/providers/third-party/google-auth";
import { AppleAuth } from "@/features/auth/providers/third-party/apple-auth";
import { OnboardingCarousel } from "@/features/auth/components/onboarding/carousel";
import { EmailAuth } from "@/features/auth/providers/otp/email-auth";
import { Header } from "@/features/auth/components/header";

export const Screen = () => {
  return (
    <SafeAreaView className="flex-1 flex-col justify-between px-2">
      <Header />
      {/* Onboarding section */}
      <OnboardingCarousel />

      {/* Action Buttons */}
      <View className="flex w-full flex-col gap-3 px-1">
        <EmailAuth />

        <GoogleAuth />

        <AppleAuth />
      </View>
    </SafeAreaView>
  );
};
