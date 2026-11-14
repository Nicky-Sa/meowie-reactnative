import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import NoMatch from "@/assets/images/errors/no-match.svg";
import { Button } from "@/features/common/ui/button";

export const Screen = () => {
  const router = useRouter();

  return (
    <View
      className={
        "flex-1 flex-col items-center justify-center gap-8 bg-neutral-15-default"
      }
    >
      <NoMatch />
      <Text className={"body-b1 max-w-xs text-center text-neutral-5-default"}>
        This screen does not exist.
      </Text>
      <Button onPress={() => router.replace("/home")} variant={"white"}>
        Go to home screen
      </Button>
    </View>
  );
};
