import { useRouter } from "expo-router";
import { useCallback } from "react";
import { MediaType } from "@/features/common/data/models/media-type";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { PostersList } from "@/features/common/posters/posters-list";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";
import { EmptyState } from "@/features/general/empty-state";
import { TabChildProps } from "@/features/common/tab/tab-bar";
import { tailwind } from "@/lib/tailwind";

type Props = TabChildProps & {
  mediaType: MediaType;
  tab: ExploreTabResDto;
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

  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/discover/media-list",
        params: { title: tab.title, endpoint, initialIndex: index },
      });
    },
    [endpoint, router, tab.title],
  );

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
