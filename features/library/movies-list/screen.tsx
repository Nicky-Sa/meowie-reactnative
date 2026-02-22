import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchLibraryPosters } from "@/features/common/posters/useFetchLibraryPosters";

export const Screen = () => {
  const { title, initialIndex, url } = useLocalSearchParams<{
    title: string;
    initialIndex: string;
    url: `/library/${string}`;
  }>();

  const posterData = useFetchLibraryPosters(url);

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
      mediaType="movie"
    />
  );
};
