import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams } from "expo-router";
import { SearchParams } from "@/features/common/data/query";
import { PostersList } from "@/features/browse/elements/posters-list";
import { FilterIndicator } from "@/features/filters/elements/filter-indicator";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { modifiedFieldsNumber, ...searchParams } = useLocalSearchParams<
    {
      modifiedFieldsNumber: string;
    } & Partial<SearchParams>
  >();

  return (
    <InnerScreen
      title={"Filters"}
      fullHeight
      fullWidth
      rightTopComponent={
        <FilterIndicator modifiedFieldsNumber={Number(modifiedFieldsNumber)} />
      }
    >
      <PostersList
        moviesListTitle={"Filters"}
        numColumns={NUM_COLUMNS}
        searchParams={searchParams}
      />
    </InnerScreen>
  );
};
