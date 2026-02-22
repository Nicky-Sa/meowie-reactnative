import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchLibrarySavedPosters } from "@/features/common/posters/useFetchLibrarySavedPosters";

export const Screen = () => {
  const { title, initialIndex } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
  }>();

  const posterData = useFetchLibrarySavedPosters();

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
      mediaType="movie"
    />
  );
};
