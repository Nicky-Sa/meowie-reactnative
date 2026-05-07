import { Screen } from "@/features/discover/media-list/screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverMediaListScreen() {
  const params = useLocalSearchParams() as unknown as Parameters<
    typeof Screen
  >[0];
  return <Screen {...params} />;
}
