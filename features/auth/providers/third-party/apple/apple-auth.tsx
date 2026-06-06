import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import AppleIcon from "@/assets/icons/apple.svg";
import { useAppleAuth } from "@/features/auth/providers/third-party/apple/data/useAppleAuth";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

export const AppleAuth = () => {
  const { loginWithApple } = useAppleAuth();
  const { dismissScreen } = useDismissScreen();
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAnalytics();

  const handleApple = async () => {
    setIsLoading(true);
    const data = await loginWithApple();
    setIsLoading(false);
    if (data && data.user) {
      auth.trackLogin({ isNewUser: data.isNewUser });
      dismissScreen();
      Toast.show({
        type: "success",
        text1: "Welcome to Meowie!",
      });
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
