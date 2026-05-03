import { Text, View } from "react-native";

type Props = {
  info: string[];
};

export const RowInfo = ({ info }: Props) => {
  return (
    <View className={"flex flex-row gap-5"}>
      {info.map((item) => (
        <Text key={item} className={"body-b2 text-neutral-5-default"}>
          {item}
        </Text>
      ))}
    </View>
  );
};
