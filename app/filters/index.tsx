import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function FiltersScreen() {
  const router = useRouter();

  return (
    <View className={"flex-1 bg-neutral-13-default"}>
      <SafeAreaView>
        <Text className={"text-neutral-10-default"}>Filters</Text>
      </SafeAreaView>
    </View>
  );
}
