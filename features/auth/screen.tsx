import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleAuth } from "@/features/auth/providers/third-party/google/google-auth";
import { AppleAuth } from "@/features/auth/providers/third-party/apple/apple-auth";
import { EmailAuth } from "@/features/auth/providers/otp/email-auth";
import { Header } from "@/features/auth/components/header";
import { Welcome } from "@/features/auth/components/welcom";

export const Screen = () => {
  return (
    <SafeAreaView className="flex-1 flex-col justify-between px-2">
      <Header />
      {/* Welcome Animation section */}
      <Welcome />

      {/* Action Buttons */}
      <View className="flex w-full flex-col gap-3 px-1">
        <EmailAuth />

        <GoogleAuth />

        {Platform.OS === "ios" && <AppleAuth />}
      </View>
    </SafeAreaView>
  );
};
