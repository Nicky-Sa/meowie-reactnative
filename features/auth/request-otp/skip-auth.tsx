import { useRouter } from "expo-router";
import { Button } from "@/features/common/ui/button";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

export const SkipAuth = () => {
  const router = useRouter();
  const { capture } = useCaptureEvent();

  const onPress = async () => {
    await AsyncStorage.setItem("skipped-auth", "true");
    capture("auth_skipped");
    router.replace("/home");
  };

  return (
    <View className={"items-center"}>
      <Button onPress={onPress} variant={"ghost"} size={"lg"}>
        Skip
      </Button>
    </View>
  );
};
