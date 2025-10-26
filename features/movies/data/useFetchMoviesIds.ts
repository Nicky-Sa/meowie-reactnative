import { useCallback, useState } from "react";
import { Fetcher } from "swr";
import useSWRInfinite from "swr/infinite";
import { MovieIdsResDTO } from "@/features/movies/data/dto/movies.dto";
import { Success } from "@/features/general/dto/success.dto";

type Props = {
  queryParams: string;
};

export const useFetchMoviesIds = ({ queryParams }: Props) => {
  const [initialRandomPage] = useState(
    () => Math.floor(Math.random() * 100) + 1,
  ); // Random page from 1 to 100

  const getKey = useCallback(
    (pageIndex: number, previousPageData: Success<MovieIdsResDTO>) => {
      const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/movies/ids`;

      // Stop fetching if there are no more results
      if (previousPageData && !previousPageData.data.results) {
        return null;
      }

      return `${baseUrl}?page=${pageIndex + (queryParams ? 1 : initialRandomPage)}&${queryParams}`; // SWR key
    },
    [initialRandomPage, queryParams],
  );

  const fetcher: Fetcher<Success<MovieIdsResDTO>> = (url: string) =>
    fetch(url).then((r) => r.json());
  const {
    data: response,
    size,
    setSize,
    isLoading,
    error,
    mutate,
  } = useSWRInfinite(getKey, fetcher);

  const idList = Array.isArray(response)
    ? response.flatMap((page) => page.data.results.map((movie) => movie.id)) // Extract `id` from each movie
    : [];

  return {
    data: idList,
    dataLength: idList.length,
    size,
    setSize,
    isLoading,
    error,
    mutate,
  };
};
