import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { MovieIdsResDto } from "@/features/movies/data/dto/movies.dto";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";

type Props = {
  queryParams: string;
};

export const useFetchMoviesIds = ({ queryParams }: Props) => {
  const getKey = useCallback(
    (pageIndex: number, previousPageData: SuccessResponse<MovieIdsResDto>) => {
      const baseUrl = "/movies/ids";

      // Stop fetching if there are no more results
      if (previousPageData && !previousPageData.data.results) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + 1}&${queryParams}`; // SWR key
    },
    [queryParams],
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
