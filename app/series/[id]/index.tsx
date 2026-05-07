import { Screen } from "@/features/discover/series-info/screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverSeriesInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Screen id={id} />;
}
