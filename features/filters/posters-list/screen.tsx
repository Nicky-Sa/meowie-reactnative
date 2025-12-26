import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SearchParams } from "@/features/common/data/query";
import { PostersList } from "@/features/browse/elements/posters-list";
import { FilterIndicator } from "@/features/filters/elements/filter-indicator";
import { useCallback } from "react";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { modifiedFieldsNumber, ...searchParams } = useLocalSearchParams<
    {
      modifiedFieldsNumber: string;
    } & Partial<SearchParams>
  >();

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/filters/movies-list",
        params: {
          initialIndex: index,
          title: "Filtered",
          modifiedFieldsNumber,
          ...searchParams,
        },
      });
    },
    [modifiedFieldsNumber, router, searchParams],
  );

  return (
    <InnerScreen
      title={"Filtered"}
      fullHeight
      fullWidth
      rightTopComponent={
        <FilterIndicator modifiedFieldsNumber={Number(modifiedFieldsNumber)} />
      }
    >
      <PostersList
        numColumns={NUM_COLUMNS}
        searchParams={searchParams}
        onPosterPress={onPosterPress}
      />
    </InnerScreen>
  );
};
