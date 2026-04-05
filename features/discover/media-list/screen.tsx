import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useLocalSearchParams } from "expo-router";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

export const Screen = () => {
  const { title, initialIndex, mediaType, ...queryParams } =
    useLocalSearchParams<
      {
        title: string;
        initialIndex: string;
        mediaType: MediaType;
      } & Partial<SearchParams>
    >();

  const posterData = useFetchPosters(`/${mediaType}/posters`, queryParams);

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
