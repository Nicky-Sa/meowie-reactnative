import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useRouter } from "expo-router";
import { PostersList } from "@/features/common/posters/posters-list";
import { SearchParams } from "@/features/common/data/media-query";
import { useCallback } from "react";
import {
  URL,
  useFetchPosters,
} from "@/features/common/posters/useFetchPosters";
import { FilterIndicator } from "@/features/filters/filter-indicator";
import { FilterEmptyState } from "@/features/filters/empty-state";

const NUM_COLUMNS = 3;

type Params = {
  title: string;
  endpoint: URL;
  modifiedFieldsNumber: string;
} & Partial<SearchParams>;

export const Screen = ({
  title,
  endpoint,
  modifiedFieldsNumber,
  ...searchParams
}: Params) => {
  const posterData = useFetchPosters(endpoint, searchParams);

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/discover/media-list",
        params: {
          title,
          endpoint,
          initialIndex: index,
          ...searchParams,
        },
      });
    },
    [endpoint, router, searchParams, title],
  );

  return (
    <InnerScreen
      title={title}
      fullHeight
      fullWidth
      rightTopComponent={
        modifiedFieldsNumber ? (
          <FilterIndicator
            modifiedFieldsNumber={Number(modifiedFieldsNumber)}
          />
        ) : undefined
      }
    >
      <PostersList
        numColumns={NUM_COLUMNS}
        posterData={posterData}
        onPosterPress={onPosterPress}
        ListEmptyComponent={
          modifiedFieldsNumber ? <FilterEmptyState /> : undefined
        }
      />
    </InnerScreen>
  );
};
