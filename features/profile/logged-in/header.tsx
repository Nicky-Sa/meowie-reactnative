import CoolMeowie from "@/assets/images/meowie/cool-meowie.svg";
import { Text, View } from "react-native";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";

type Props = {
  email: string;
};

export const Header = ({ email }: Props) => {
  const { paddingTop } = useMainScreenContentStyle();
  return (
    <View
      className="flex-col items-center justify-center gap-4"
      style={{ paddingTop }}
    >
      <CoolMeowie />
      <Text className="body-b2 text-center text-neutral-10-default">
        {email}
      </Text>
    </View>
  );
};
