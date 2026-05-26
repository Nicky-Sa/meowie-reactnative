import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import GoogleIcon from "@/assets/icons/google.svg";
import { useState } from "react";
import { useThirdPartyAuth } from "@/features/auth/providers/third-party/data/useThirdPartyAuth";
import { useRouter } from "expo-router";

export const GoogleAuth = () => {
  const { loginWithGoogle } = useThirdPartyAuth();
  const router = useRouter();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await loginWithGoogle();
    setIsGoogleLoading(false);
    router.replace("/home");
  };

  return (
    <Button
      variant="black"
      size="lg"
      onPress={handleGoogle}
      isLoading={isGoogleLoading}
      icon={<Icon i={GoogleIcon} />}
    >
      Continue with Google
    </Button>
  );
};
