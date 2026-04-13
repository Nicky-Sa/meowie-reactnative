import { Button } from "@/features/common/ui/button";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useDismissScreen } from "@/features/auth/use-dismiss-screen";

export const SkipAuth = () => {
  const { dismissScreen } = useDismissScreen();
  const { capture } = useCaptureEvent();

  const onPress = async () => {
    capture("auth_skipped");
    await AsyncStorage.setItem("skipped-auth", "true");
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
