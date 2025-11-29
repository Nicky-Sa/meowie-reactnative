import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import { Filters, filtersAtom, initialFiltersValue } from "@/atoms";
import _ from "lodash";
import { useAtom } from "jotai/index";
import { MovieIdsResDto } from "@/features/movies/data/dto/movie-ids.dto";

const filterToQuery = (filters: Filters) => {
  return `${Object.entries(filters)
    .filter(
      ([key, value]) =>
        !_.isEqual(value, initialFiltersValue[key as keyof Filters]),
    )
    .map(([key, value]) => `${key}=${value.toString()}`)
    .join("&")}`;
};

export const useFetchMoviesIds = () => {
  const [filters] = useAtom(filtersAtom);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: SuccessResponse<MovieIdsResDto>) => {
      const baseUrl = "/movies/ids";

      // Stop fetching if there are no more results
      if (previousPageData && !previousPageData.data.results) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + 1}&${filterToQuery(filters)}`; // SWR key
    },
    [filters],
  );

  const { data: response, ...rest } = useSWRInfinite<
    SuccessResponse<MovieIdsResDto>,
    Error
  >(getKey, fetcher);

  const idList = Array.isArray(response)
    ? response.flatMap((page) => page.data.results.map((movie) => movie.id)) // Extract `id` from each movie
    : [];

  return {
    data: idList,
    dataLength: idList.length,
    ...rest,
  };
};
