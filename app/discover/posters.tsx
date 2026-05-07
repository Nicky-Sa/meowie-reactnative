import { Screen } from "@/features/discover/posters/screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverPostersScreen() {
  const params = useLocalSearchParams() as unknown as Parameters<
    typeof Screen
  >[0];
  return <Screen {...params} />;
}
