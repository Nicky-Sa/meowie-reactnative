import { TMDB_MoviesList } from "@/models/tmdb/moviesList";
import { useCallback, useState } from "react";
import { Fetcher } from "swr";
import useSWRInfinite from "swr/infinite";

type Props = {
  queryParams: string;
};

export const useFetchMoviesIds = ({ queryParams }: Props) => {
  const [initialRandomPage] = useState(
    () => Math.floor(Math.random() * 100) + 1,
  ); // Random page from 1 to 100

  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: {
        results: TMDB_MoviesList["results"];
      },
    ) => {
      const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/movies/ids`;

      // Stop fetching if there are no more results
      if (previousPageData && !previousPageData.results.length) return null;

      return `${baseUrl}?page=${pageIndex + (queryParams ? 1 : initialRandomPage)}&${queryParams}`; // SWR key
    },
    [initialRandomPage, queryParams],
  );

  const fetcher: Fetcher<TMDB_MoviesList> = (url: string) =>
    fetch(url).then((r) => r.json());
  const { data, size, setSize, isLoading, error, mutate } = useSWRInfinite(
    getKey,
    fetcher,
  );

  const idList = Array.isArray(data)
    ? data.flatMap((page) => page.results.map((movie) => movie.id)) // Extract `id` from each movie
    : [];

  return { data: idList, size, setSize, isLoading, error, mutate };
};
