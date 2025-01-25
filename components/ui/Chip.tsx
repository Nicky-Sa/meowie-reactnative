import { View, Text } from "react-native";

type Props = {
  text: string
};

const Chip = ({ text }: Props) => {
  return (
    <View className={"bg-primary-100 rounded-full px-3 py-1"}>
      <Text className={"text-text-primary-foreground font-bold"}>{text}</Text>
    </View>
  );
};
export default Chip;
