import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useRouter } from "expo-router";
import { PostersList } from "@/features/common/posters/posters-list";
import { SearchParams } from "@/features/common/data/media-query";
import { useCallback } from "react";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { PostersUrl } from "@/features/common/posters/types";
import { FilterIndicator } from "@/features/filters/filter-indicator";
import { EmptyState } from "@/features/general/empty-state";

type Params = {
  title: string;
  endpoint: PostersUrl;
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
        posterData={posterData}
        onPosterPress={onPosterPress}
        ListEmptyComponent={
          modifiedFieldsNumber ? (
            <EmptyState
              text={
                "Nothing matched your filters!\nPlease try different filters."
              }
            />
          ) : undefined
        }
      />
    </InnerScreen>
  );
};
