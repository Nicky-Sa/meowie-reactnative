import useSWRInfinite from "swr/infinite";
import { useCallback } from "react";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import { MoviePosterResDto } from "@/features/movies/deep-dive/data/poster/poster.dto";
import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { filterToQuery } from "@/lib/functions";

export const useFetchMoviesPoster = () => {
  const [filters] = useAtom(filtersAtom);

  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: SuccessResponse<MoviePosterResDto>,
    ) => {
      const baseUrl = "/movies/poster";
      const filtersQuery = filterToQuery(filters);

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + 1}&${filtersQuery}`; // SWR key
    },
    [filters],
  );

  const {
    data: response,
    size,
    setSize,
    ...rest
  } = useSWRInfinite<SuccessResponse<MoviePosterResDto>, Error>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      // Mobile UX: Don't refetch on app switch
      revalidateOnFocus: false,
      keepPreviousData: true,
      // Cache: Trust the cache for 5 minutes
      dedupingInterval: 300000,
    },
  );

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
