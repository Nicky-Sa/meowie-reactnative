import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import AppleIcon from "@/assets/icons/apple.svg";
import { useRouter } from "expo-router";
import { useAppleAuth } from "@/features/auth/providers/third-party/apple/data/useAppleAuth";
import { useState } from "react";

export const AppleAuth = () => {
  const { loginWithApple } = useAppleAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApple = async () => {
    setIsLoading(true);
    const response = await loginWithApple();
    setIsLoading(false);
    if (response && response.user) {
      router.replace("/home");
    }
  };

  return (
    <Button
      variant="black"
      size="lg"
      onPress={handleApple}
      isLoading={isLoading}
      icon={<Icon i={AppleIcon} />}
    >
      Continue with Apple
    </Button>
  );
};
