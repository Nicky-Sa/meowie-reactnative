import { useCallback } from "react";
import { PurifiedMovieIdsResDto } from "@/features/movies/data/dto/movie-ids.dto";
import { Sort } from "@/features/common/data/query";
import {
  SWRInfiniteKeyLoader,
  useSWRPaginatedConfigured,
} from "@/features/common/data/swr-config";

const random = Math.floor(Math.random() * 100) + 1;

type Args = {
  sort: Sort;
};

export const useFetchPurifiedMoviesIds = ({ sort }: Args) => {
  const getKey: SWRInfiniteKeyLoader<PurifiedMovieIdsResDto> = useCallback(
    (pageIndex, previousPageData) => {
      const baseUrl = "/movies/purified-ids";

      const initialPage = sort === "random" ? random : 1;

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + initialPage}&sort=${sort}`; // SWR key
    },
    [sort],
  );

  const { data: response, ...rest } =
    useSWRPaginatedConfigured<PurifiedMovieIdsResDto>(getKey);

  // Extract `id` from each movie
  // The list is accumulated from all pages
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
    ...rest,
  };
};
