import { APIMoviesList } from "@/models/moviesList";
import { Fetcher } from "swr";
import useSWRInfinite from "swr/infinite";

const getKey = (pageIndex: number, previousPageData: any) => {
  const apiKey = "REDACTED";
  const baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=true&language=en-US&sort_by=popularity.desc&api_key=${apiKey}`;

  // Stop fetching if there are no more results
  if (previousPageData && !previousPageData.results.length) return null;

  return `${baseUrl}&page=${pageIndex + 1}`; // SWR key
};

export const useFetchMoviesIdList = () => {
  const fetcher: Fetcher<APIMoviesList> = (url: string) =>
    fetch(url).then((r) => r.json());
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher);

  const idList = data
    ? data.flatMap((page) => page.results.map((movie) => movie.id)) // Extract `id` from each movie
    : [];

  return { data: idList, size, setSize, isLoading };
};
