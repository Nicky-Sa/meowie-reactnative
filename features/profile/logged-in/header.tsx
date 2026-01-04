import CoolMeowie from "@/assets/images/profile/cool-meowie.svg";
import { Text, View } from "react-native";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";

type Props = {
  email: string;
};
export const Header = ({ email }: Props) => {
  const { paddingTop } = useMainScreenContentStyle();

  return (
    <View
      className="flex-col items-center justify-center gap-4 bg-neutral-15-default pb-6"
      style={{ marginTop: paddingTop }} // to avoid covering the colorful oval
    >
      <CoolMeowie />
      <Text className="body-b2 text-center text-neutral-10-default">
        {email}
      </Text>
    </View>
  );
};
