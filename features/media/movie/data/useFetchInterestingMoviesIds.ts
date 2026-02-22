import { useCallback, useEffect, useMemo } from "react";
import { InterestingMovieIdsResDto } from "@/features/media/movie/data/dto/movies.dto";
import { SortOption } from "@/features/common/data/media-query";
import {
  SWRInfiniteKeyLoader,
  useSWRPaginatedConfigured,
} from "@/features/common/data/swr/hooks";
import { MediaListItemData } from "@/features/media/components/list/types";

type Args = {
  sort: SortOption;
};

export const useFetchInterestingMoviesIds = ({ sort }: Args) => {
  const initialPage = useMemo(
    () =>
      sort === SortOption.RANDOM ? Math.floor(Math.random() * 100) + 1 : 1,
    [sort],
  );

  const getKey: SWRInfiniteKeyLoader<InterestingMovieIdsResDto> = useCallback(
    (pageIndex, previousPageData) => {
      const baseUrl = "/movie/interesting-ids";

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + initialPage}&sort=${sort}`; // SWR key
    },
    [initialPage, sort],
  );

  const {
    data: response,
    setSize,
    ...rest
  } = useSWRPaginatedConfigured<InterestingMovieIdsResDto>(getKey);

  // Force reset size when sort changes
  useEffect(() => {
    setSize(1);
  }, [sort, setSize]);

  // Extract `id` from each movie
  // The list is accumulated from all pages
  const rawData = Array.isArray(response)
    ? response.map((page) => page.data.results)
    : [];

  const flattenedData: MediaListItemData[] = rawData.flat().map((id) => ({
    id,
    mediaType: "movie",
  }));

  const totalPages = Array.isArray(response)
    ? response[0]?.data.total_pages
    : 0;

  return {
    data: flattenedData,
    dataLength: flattenedData.length,
    totalPages,
    setSize,
    ...rest,
  };
};
