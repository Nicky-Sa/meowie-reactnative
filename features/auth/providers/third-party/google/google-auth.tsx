import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import GoogleIcon from "@/assets/icons/google.svg";
import { useGoogleAuth } from "@/features/auth/providers/third-party/google/data/use-google-auth";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

export const GoogleAuth = () => {
  const { loginWithGoogle } = useGoogleAuth();
  const { dismissScreen } = useDismissScreen();
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAnalytics();

  const handleGoogle = async () => {
    setIsLoading(true);
    const data = await loginWithGoogle();
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
      onPress={handleGoogle}
      isLoading={isLoading}
      icon={<Icon i={GoogleIcon} />}
    >
      Continue with Google
    </Button>
  );
};
