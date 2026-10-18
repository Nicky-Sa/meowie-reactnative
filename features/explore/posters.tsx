import { useRouter } from "expo-router";
import { MediaType } from "@/features/common/data/models/media-type";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { PostersList } from "@/features/common/posters/posters-list";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";
import { EmptyState } from "@/features/general/empty-state";

type Props = {
  mediaType: MediaType;
  tab: ExploreTabResDto;
};

export const ExplorePosters = ({ mediaType, tab }: Props) => {
  const endpoint =
    `/explore/${mediaType}/tabs/${encodeURIComponent(tab.slug)}` as const;
  const posterData = useFetchPosters(endpoint);
  const { paddingBottom } = useMainScreenContentStyle();
  const router = useRouter();

  const onPosterPress = (index: number) => {
    router.push({
      pathname: "/discover/media-list",
      params: { title: tab.title, endpoint, initialIndex: index },
    });
  };

  return (
    <PostersList
      numColumns={3}
      posterData={posterData}
      onPosterPress={onPosterPress}
      ListEmptyComponent={posterData.hasNextPage ? undefined : <EmptyState />}
      contentContainerStyle={{ paddingBottom }}
    />
  );
};
