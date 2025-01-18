import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className={"flex items-center justify-center"}>
      <Text>Details of movie {id} </Text>
    </View>
  );
}
