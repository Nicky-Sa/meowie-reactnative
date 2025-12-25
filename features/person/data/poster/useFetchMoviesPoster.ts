import { useCallback } from "react";
import { SuccessResponse } from "@/features/common/data/transformers";
import { MoviePosterResDto } from "@/features/person/data/poster/poster.dto";
import { SearchParams } from "@/features/common/data/query";
import { searchParamsToQuery } from "@/lib/functions";
import { useSWRInfiniteConfigured } from "@/features/common/data/swr-config";

type Args = Partial<SearchParams>;

export const useFetchMoviesPoster = (searchParams: Args) => {
  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: SuccessResponse<MoviePosterResDto>,
    ) => {
      const baseUrl = "/movies/poster";
      const searchQuery = searchParamsToQuery(searchParams);

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + 1}&${searchQuery}`; // SWR key
    },
    [searchParams],
  );

  const {
    data: response,
    size,
    setSize,
    ...rest
  } = useSWRInfiniteConfigured<MoviePosterResDto>(getKey);

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
