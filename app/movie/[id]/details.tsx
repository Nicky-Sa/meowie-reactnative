import { Screen } from "@/features/media/movie/details/screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverMovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Screen movieId={id} />;
}
