import { useCallback } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/functions";
import {
  SWRInfiniteKeyLoader,
  useSWRPaginatedConfigured,
} from "@/features/common/data/swr/hooks";
import { SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

export const useFetchDiscoveredPosters = (
  queryParams: Partial<SearchParams>,
  mediaType: MediaType,
) => {
  const getKey: SWRInfiniteKeyLoader<PosterResDto> = useCallback(
    (pageIndex, previousPageData) => {
      const baseUrl = `/${mediaType}/posters`;
      const query = searchParamsToQuery(queryParams);

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + 1}&${query}`; // SWR key
    },
    [mediaType, queryParams],
  );

  const {
    data: response,
    size,
    setSize,
    ...rest
  } = useSWRPaginatedConfigured<PosterResDto>(getKey);

  const rawData = Array.isArray(response)
    ? response.map((page) => page.data.results)
    : [];

  const flattenedData = rawData.flat();

  const totalPages = Array.isArray(response)
    ? response[0]?.data.total_pages
    : 0;

  return {
    data: flattenedData,
    dataLength: flattenedData.length,
    totalPages,
    size,
    setSize,
    ...rest,
  };
};
