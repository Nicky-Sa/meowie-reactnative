import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchDiscoveredPosters } from "@/features/common/posters/useFetchDiscoveredPosters";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = () => {
  const { title, initialIndex, ...queryParams } = useLocalSearchParams<
    {
      title: string;
      initialIndex: string;
    } & Partial<SearchParams>
  >();

  const posterData = useFetchDiscoveredPosters(queryParams, "tv");

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
      mediaType="tv"
    />
  );
};
