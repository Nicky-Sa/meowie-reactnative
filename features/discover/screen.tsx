import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PostersList } from "@/features/common/posters/posters-list";
import { SearchParams } from "@/features/common/data/media-query";
import { useCallback } from "react";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { MediaType } from "@/features/common/data/models/media-type";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { title, mediaType, ...searchParams } = useLocalSearchParams<
    { title: string; mediaType: MediaType } & Partial<SearchParams>
  >();

  const posterData = useFetchPosters(`/${mediaType}/posters`, searchParams);

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      const pathname =
        mediaType === "tv" ? "/discover/tv-list" : "/discover/movies-list";
      router.push({
        pathname,
        params: {
          initialIndex: index,
          title,
          mediaType,
          ...searchParams,
        },
      });
    },
    [router, searchParams, title, mediaType],
  );

  return (
    <InnerScreen title={title} fullHeight fullWidth>
      <PostersList
        numColumns={NUM_COLUMNS}
        posterData={posterData}
        onPosterPress={onPosterPress}
      />
    </InnerScreen>
  );
};
