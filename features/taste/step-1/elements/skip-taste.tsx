import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";

export const SkipTaste = () => {
  const router = useRouter();

  const onPress = async () => {
    router.replace("/(tabs)/home");
  };

  return (
    <Button onPress={onPress} variant={"ghost"} size={"md"}>
      Skip
    </Button>
  );
};
