import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PostersList } from "@/features/common/posters/posters-list";
import { SearchParams } from "@/features/common/data/media-query";
import { useCallback } from "react";
import { useFetchMoviePosters } from "@/features/common/posters/useFetchMoviePosters";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { title, ...searchParams } = useLocalSearchParams<
    { title: string } & Partial<SearchParams>
  >();

  const posterData = useFetchMoviePosters(searchParams);

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/discover/movies-list",
        params: {
          initialIndex: index,
          title,
          ...searchParams,
        },
      });
    },
    [router, searchParams, title],
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
