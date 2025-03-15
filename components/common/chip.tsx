import { View, Text } from "react-native";

type Props = {
  text: string;
};

const Chip = ({ text }: Props) => {
  return (
    <View className={"rounded-full bg-neutral-1-default px-3 py-1"}>
      <Text className={"text-text-primary-foreground font-bold"}>{text}</Text>
    </View>
  );
};
export default Chip;
