import { View, Text } from "react-native";

type Props = {
  text: string;
};

const Chip = ({ text }: Props) => {
  return (
    <View className={"rounded-full bg-neutral-10-default px-3 py-1"}>
      <Text className={"font-bold text-neutral-10-default"}>{text}</Text>
    </View>
  );
};
export default Chip;
