import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@/features/common/button";
import { useIsAuthenticated } from "@/features/general/data/useIsAuthenticated";

export default function ProfileScreen() {
  const { data } = useIsAuthenticated();
  return (
    <View
      className={
        "flex-1 items-center justify-center gap-4 bg-neutral-15-default"
      }
    >
      <Text className={"text-neutral-10-default"}>
        Authenticated:
        {String(data?.isAuthenticated)}
      </Text>
      <Button onPress={() => AsyncStorage.removeItem("skipped-auth")}>
        Remove skip auth
      </Button>
    </View>
  );
}
