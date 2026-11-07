import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { PostersUrl } from "@/features/common/posters/types";
import { SearchParams } from "@/features/common/data/media-query";

export const Screen = ({
  title,
  endpoint,
  initialIndex,
  ...searchParams
}: {
  title: string;
  endpoint: PostersUrl;
  initialIndex: string;
} & Partial<SearchParams>) => {
  const posterData = useFetchPosters(endpoint, searchParams, {
    refetchOnMount: false, // keeping the cache before closing the app as the explore content comes back shuffled
  });

  return (
    <MediaListScreen
      title={title}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      posterData={posterData}
    />
  );
};
