import { useRouter } from "expo-router";
import { Button } from "@/features/common/button";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SkipAuth = () => {
  const router = useRouter();

  const onPress = async () => {
    await AsyncStorage.setItem("skipped-auth", "true");
    router.replace("/movies");
  };

  return (
    <View className={"items-center"}>
      <Button onPress={onPress} variant={"ghost"} size={"lg"}>
        Skip
      </Button>
    </View>
  );
};
