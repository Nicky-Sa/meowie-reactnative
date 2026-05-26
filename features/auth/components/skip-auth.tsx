import { Button } from "@/features/common/ui/button";
import { AppStorage } from "@/features/common/data/utils/app-storage";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";

export const SkipAuth = () => {
  const { dismissScreen } = useDismissScreen();
  const { auth } = useAnalytics();

  const onPress = async () => {
    auth.trackAuthSkipped();
    AppStorage.setItem("skipped-auth", "true");
    dismissScreen();
  };

  return (
    <Button onPress={onPress} variant={"ghost"} size={"md"}>
      Skip
    </Button>
  );
};
