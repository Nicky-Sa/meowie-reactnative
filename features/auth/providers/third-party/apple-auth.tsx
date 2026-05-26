import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import AppleIcon from "@/assets/icons/apple.svg";
import { useThirdPartyAuth } from "@/features/auth/providers/third-party/data/useThirdPartyAuth";
import { useRouter } from "expo-router";

export const AppleAuth = () => {
  const { loginWithApple } = useThirdPartyAuth();
  const router = useRouter();

  const handleApple = async () => {
    await loginWithApple();
    router.replace("/home");
  };

  return (
    <Button
      variant="black"
      size="lg"
      onPress={handleApple}
      icon={<Icon i={AppleIcon} />}
    >
      Continue with Apple
    </Button>
  );
};
