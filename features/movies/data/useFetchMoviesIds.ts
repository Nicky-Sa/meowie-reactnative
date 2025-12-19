import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import { SearchParams } from "@/features/common/data/query";
import { MovieIdsResDto } from "@/features/movies/data/dto/movie-ids.dto";
import { searchParamsToQuery } from "@/lib/functions";
import { useAtom } from "jotai";
import { sortAtom } from "@/atoms";

const random = Math.floor(Math.random() * 100) + 1;

type Args = Partial<SearchParams>;

export const useFetchMoviesIds = (searchParams?: Args) => {
  const [sort] = useAtom(sortAtom);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: SuccessResponse<MovieIdsResDto>) => {
      const baseUrl = "/movies/ids";
      const searchQuery = searchParamsToQuery(searchParams);

      const initialPage = sort === "random" ? random : 1;

      // Stop fetching if there are no more results
      if (previousPageData && previousPageData.data.results.length === 0) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + initialPage}&${searchQuery}&sort=${sort}`; // SWR key
    },
    [searchParams, sort],
  );

  const { data: response, ...rest } = useSWRInfinite<
    SuccessResponse<MovieIdsResDto>,
    Error
  >(getKey, fetcher);

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
