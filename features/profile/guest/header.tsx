import SleepingMeowie from "@/assets/images/sleeping-meowie.svg";
import { Text, View } from "react-native";

export const Header = () => {
  return (
    <View
      className="flex-col items-center justify-center gap-4 bg-neutral-15-default pb-4"
      pointerEvents={"none"}
    >
      <SleepingMeowie />
      <Text className="body-b2 text-center text-neutral-10-default">
        {`Welcome to Meowie!`}
        {"\n"}
        {`Sign in to sync your library.`}
      </Text>
    </View>
  );
};
