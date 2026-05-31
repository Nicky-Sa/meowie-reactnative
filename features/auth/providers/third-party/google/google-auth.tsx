import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import GoogleIcon from "@/assets/icons/google.svg";
import { useRouter } from "expo-router";
import { useGoogleAuth } from "@/features/auth/providers/third-party/google/data/useGoogleAuth";
import { useState } from "react";

export const GoogleAuth = () => {
  const { loginWithGoogle } = useGoogleAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogle = async () => {
    setIsLoading(true);
    const response = await loginWithGoogle();
    setIsLoading(false);
    if (response && response.user) {
      router.replace("/home");
    }
  };

  return (
    <Button
      variant="black"
      size="lg"
      onPress={handleGoogle}
      isLoading={isLoading}
      icon={<Icon i={GoogleIcon} />}
    >
      Continue with Google
    </Button>
  );
};
