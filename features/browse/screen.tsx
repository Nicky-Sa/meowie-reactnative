import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PostersList } from "@/features/browse/elements/posters-list";
import { SearchParams } from "@/features/common/data/query";
import { useCallback } from "react";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { title, ...searchParams } = useLocalSearchParams<
    { title: string } & Partial<SearchParams>
  >();

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/browse/movies-list",
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
        searchParams={searchParams}
        onPosterPress={onPosterPress}
      />
    </InnerScreen>
  );
};
