import { Text, View } from "react-native";

type Props = {
  info: string[];
};

export const RowInfo = ({ info }: Props) => {
  return (
    <View className={"flex flex-row gap-5"}>
      {info.map((item, i) => (
        // It's OK to use `i` as the key here as we don't expect the array to change and the text is not necessarily unique
        <Text key={i} className={"body-b2 text-neutral-5-default"}>
          {item}
        </Text>
      ))}
    </View>
  );
};
