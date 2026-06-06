import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import {
  URL,
  useFetchPosters,
} from "@/features/common/posters/use-fetch-posters";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = ({
  title,
  endpoint,
  initialIndex,
  ...searchParams
}: {
  title: string;
  endpoint: URL;
  initialIndex: string;
} & Partial<SearchParams>) => {
  const posterData = useFetchPosters(endpoint, searchParams);

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
