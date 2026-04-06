import { useMemo } from "react";
import { InterestingSeriesIdsResDto } from "@/features/media/series/data/dto/series.dto";
import { SortOption } from "@/features/common/data/media-query";
import { useQueryPaginatedConfigured } from "@/features/common/data/query/hooks";
import { MediaListItemData } from "@/features/media/components/list/types";
import { deduplicate } from "@/features/common/data/utils/deduplicate";

type Args = {
  sort: SortOption;
};

export const useFetchInterestingSeriesIds = ({ sort }: Args) => {
  const initialPage = useMemo(
    () =>
      sort === SortOption.RANDOM ? Math.floor(Math.random() * 100) + 1 : 1,
    [sort],
  );

  const baseUrl = "/series/interesting-ids";
  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest
  } = useQueryPaginatedConfigured<InterestingSeriesIdsResDto>(
    [baseUrl, sort, initialPage],
    (pageParam: number) =>
      `${baseUrl}?page=${pageParam + initialPage}&sort=${sort}`,
  );

  // Extract `id` from each tv
  // The list is accumulated from all pages
  const rawData = Array.isArray(response)
    ? response.map((page) => page.data.results)
    : [];

  const flattenedData: MediaListItemData[] = deduplicate(
    rawData.flat().map((id) => ({
      id,
      mediaType: "series" as const,
    })),
    (item) => `${item.mediaType}-${item.id}`,
  );

  const totalPages = Array.isArray(response)
    ? response[0]?.data.total_pages
    : 0;

  return {
    data: flattenedData,
    dataLength: flattenedData.length,
    totalPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest,
  };
};
