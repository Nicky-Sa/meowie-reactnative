import { View, Text } from "react-native";

type Props = {
  text: string;
};

const Chip = ({ text }: Props) => {
  return (
    <View className={"rounded-full bg-primary-100 px-3 py-1"}>
      <Text className={"font-bold text-text-primary-foreground"}>{text}</Text>
    </View>
  );
};
export default Chip;
