import { useRouter } from "expo-router";
import { MediaType } from "@/features/common/data/models/media-type";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { PostersList } from "@/features/common/posters/posters-list";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";
import { EmptyState } from "@/features/general/empty-state";
import { ScrollHandlerProcessed } from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";

type Props = {
  mediaType: MediaType;
  tab: ExploreTabResDto;
  scrollHandler: ScrollHandlerProcessed;
  headerHeight: number;
};

export const ExplorePosters = ({
  mediaType,
  tab,
  scrollHandler,
  headerHeight,
}: Props) => {
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
      scrollHandler={scrollHandler}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{
        paddingTop: headerHeight + Number(tailwind.theme.spacing["2"]),
        paddingBottom,
      }}
    />
  );
};
