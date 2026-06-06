import SleepingMeowie from "@/assets/images/meowie/sleeping-meowie.svg";
import { Text, View } from "react-native";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";

export const Header = () => {
  const { paddingTop } = useMainScreenContentStyle();

  return (
    <View
      className="flex-col items-center justify-center gap-4"
      style={{ paddingTop }}
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
