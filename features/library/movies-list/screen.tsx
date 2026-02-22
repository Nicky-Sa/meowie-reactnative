import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";

export const Screen = () => {
  const { title, initialIndex } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
  }>();

  const posterData = useFetchPosters("/library/saved");

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
      mediaType="movie"
    />
  );
};
