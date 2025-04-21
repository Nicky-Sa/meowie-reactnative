import { View, Text } from "react-native";

type Props = {
  text: string;
};

const Chip = ({ text }: Props) => {
  return (
    <View className={"rounded-full bg-neutral-11-default px-2.5 py-1"}>
      <Text className={"body-b2 text-neutral-6-default"}>{text}</Text>
    </View>
  );
};
export default Chip;
