import { useCallback } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { searchParamsToQuery } from "@/lib/functions";
import {
  SWRInfiniteKeyLoader,
  useSWRPaginatedConfigured,
} from "@/features/common/data/swr/hooks";
import { SearchParams } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { deduplicate } from "@/features/common/data/deduplicate";

type URL =
  | `/person/${string}/posters`
  | `/${MediaType}/posters`
  | "/library/saved/";

export const useFetchPosters = (
  url: URL,
  queryParams?: Partial<SearchParams>,
  initialSize?: number,
) => {
  const getKey: SWRInfiniteKeyLoader<PosterResDto> = useCallback(
    (pageIndex, previousPageData) => {
      const query = searchParamsToQuery(queryParams);

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${url}?page=${pageIndex + 1}&${query}`; // SWR key
    },
    [queryParams, url],
  );

  const {
    data: response,
    size,
    setSize,
    ...rest
  } = useSWRPaginatedConfigured<PosterResDto>(getKey, { initialSize });

  const rawData = Array.isArray(response)
    ? response.map((page) => page.data.results)
    : [];

  const flattenedData = deduplicate(
    rawData.flat(),
    (item) => `${item.mediaType}-${item.id}`,
  );

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
