import { View, Text } from "react-native";

export const EmptyState = () => {
  return (
    <View className={"flex-1 flex-col items-center justify-center gap-8"}>
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        No data to show.
      </Text>
    </View>
  );
};
