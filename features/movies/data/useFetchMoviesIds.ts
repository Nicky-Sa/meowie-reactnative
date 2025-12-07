import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import { Filters, filtersAtom, initialFiltersValue, sortAtom } from "@/atoms";
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

const random = Math.floor(Math.random() * 100) + 1;

export const useFetchMoviesIds = () => {
  const [filters] = useAtom(filtersAtom);
  const [sort] = useAtom(sortAtom);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: SuccessResponse<MovieIdsResDto>) => {
      const baseUrl = "/movies/ids";
      const filtersQuery = filterToQuery(filters);
      const initialPage = sort === "random" && !filtersQuery ? random : 1;

      // Stop fetching if there are no more results
      if (previousPageData && !previousPageData.data.results) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + initialPage}&${filtersQuery}&sort=${sort}`; // SWR key
    },
    [filters, sort],
  );

  const { data: response, ...rest } = useSWRInfinite<
    SuccessResponse<MovieIdsResDto>,
    Error
  >(getKey, fetcher);

  // Extract `id` from each movie
  const idList = Array.isArray(response)
    ? response.flatMap((page) => page.data.results.map((movie) => movie.id))
    : [];

  return {
    data: idList,
    dataLength: idList.length,
    key: JSON.stringify({ ...filters, sort }),
    ...rest,
  };
};
