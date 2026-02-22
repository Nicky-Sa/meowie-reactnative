import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = () => {
  const { title, initialIndex, ...queryParams } = useLocalSearchParams<
    {
      title: string;
      initialIndex: string;
    } & Partial<SearchParams>
  >();

  const posterData = useFetchPosters("/movie/posters", queryParams);

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
      mediaType="movie"
    />
  );
};
