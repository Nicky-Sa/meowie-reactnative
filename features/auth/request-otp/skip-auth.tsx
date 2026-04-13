import { Button } from "@/features/common/ui/button";
import { View } from "react-native";
import { AppStorage } from "@/features/common/data/utils/app-storage";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useDismissScreen } from "@/features/auth/use-dismiss-screen";

export const SkipAuth = () => {
  const { dismissScreen } = useDismissScreen();
  const { capture } = useCaptureEvent();

  const onPress = async () => {
    capture("auth_skipped");
    AppStorage.setItem("skipped-auth", "true");
    dismissScreen();
  };

  return (
    <View className={"items-center"}>
      <Button onPress={onPress} variant={"ghost"} size={"lg"}>
        Skip
      </Button>
    </View>
  );
};
