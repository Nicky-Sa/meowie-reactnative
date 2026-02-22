import { useCallback } from "react";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import {
  SWRInfiniteKeyLoader,
  useSWRPaginatedConfigured,
} from "@/features/common/data/swr/hooks";

export const useFetchLibrarySavedPosters = () => {
  const getKey: SWRInfiniteKeyLoader<PosterResDto> = useCallback(
    (pageIndex, previousPageData) => {
      const url = "/library/saved";
      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${url}?page=${pageIndex + 1}`; // SWR key
    },
    [],
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
