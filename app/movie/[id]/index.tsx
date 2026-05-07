import { Screen } from "@/features/discover/movie-info/screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverMovieInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Screen id={id} />;
}
