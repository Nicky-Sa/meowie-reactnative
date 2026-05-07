import { Screen } from "@/features/media/series/details/screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverSeriesDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Screen seriesId={id} />;
}
