import { useState } from "react";
import { View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { Button } from "@/features/common/ui/button";
import { useThirdPartyAuth } from "@/features/auth/providers/third-party/data/useThirdPartyAuth";

export const ThirdPartyAuthButtons = () => {
  const { loginWithGoogle, loginWithApple } = useThirdPartyAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      // error handled in hook
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleApple = async () => {
    try {
      await loginWithApple();
    } catch {
      // error handled in hook
    }
  };

  return (
    <View className="flex w-full flex-col gap-3">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={8}
        style={{ width: "100%", height: 50 }}
        onPress={handleApple}
      />
      <Button
        variant="white"
        size="lg"
        onPress={handleGoogle}
        isLoading={isGoogleLoading}
        style={{ height: 50 }}
      >
        Sign in with Google
      </Button>
    </View>
  );
};
