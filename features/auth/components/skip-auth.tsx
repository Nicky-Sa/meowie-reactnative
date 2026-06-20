import { Button } from "@/features/common/ui/button";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";

export const SkipAuth = () => {
  const { dismissScreen } = useDismissScreen();
  const { auth } = useAnalytics();

  const onPress = async () => {
    auth.trackAuthSkipped();
    appStorage.setItem(APP_STORAGE_KEYS.SKIPPED_AUTH, "true");
    dismissScreen();
  };

  return (
    <Button onPress={onPress} variant={"ghost"} size={"md"}>
      Skip
    </Button>
  );
};
