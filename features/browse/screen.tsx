import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams } from "expo-router";
import { PostersList } from "@/features/browse/elements/posters-list";
import { SearchParams } from "@/features/common/data/query";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { title, ...searchParams } = useLocalSearchParams<
    { title: string } & Partial<SearchParams>
  >();

  return (
    <InnerScreen title={title} fullHeight fullWidth>
      <PostersList
        moviesListTitle={title}
        numColumns={NUM_COLUMNS}
        searchParams={searchParams}
      />
    </InnerScreen>
  );
};
