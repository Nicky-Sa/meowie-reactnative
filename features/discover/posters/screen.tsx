import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PostersList } from "@/features/common/posters/posters-list";
import { SearchParams } from "@/features/common/data/media-query";
import { useCallback } from "react";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { MediaType } from "@/features/common/data/models/media-type";
import { FilterIndicator } from "@/features/filters/filter-indicator";
import { FilterEmptyState } from "@/features/filters/empty-state";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { title, mediaType, modifiedFieldsNumber, ...searchParams } =
    useLocalSearchParams<
      {
        title: string;
        mediaType: MediaType;
        modifiedFieldsNumber: string;
      } & Partial<SearchParams>
    >();

  const posterData = useFetchPosters(`/${mediaType}/posters`, searchParams);

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/discover/media-list",
        params: {
          initialIndex: index,
          initialSize: posterData.size,
          title,
          mediaType,
          ...searchParams,
        },
      });
    },
    [router, searchParams, title, mediaType, posterData.size],
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
