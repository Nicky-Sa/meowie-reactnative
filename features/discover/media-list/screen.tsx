import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import {
  URL,
  useFetchPosters,
} from "@/features/common/posters/useFetchPosters";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = () => {
  const { title, endpoint, initialIndex, ...searchParams } =
    useLocalSearchParams<
      {
        title: string;
        endpoint: URL;
        initialIndex: string;
      } & Partial<SearchParams>
    >();

  const posterData = useFetchPosters(endpoint, searchParams);

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
