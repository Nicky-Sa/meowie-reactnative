import SleepingMeowie from "@/assets/images/profile/sleeping-meowie.svg";
import { Text, View } from "react-native";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";

export const Header = () => {
  const { paddingTop } = useMainScreenContentStyle();

  return (
    <View
      className="flex-col items-center justify-center gap-4 bg-neutral-15-default pb-6"
      style={{ paddingTop }}
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
