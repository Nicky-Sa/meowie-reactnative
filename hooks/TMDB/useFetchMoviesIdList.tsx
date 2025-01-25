import { APIMoviesList } from "@/models/moviesList";
import { Fetcher } from "swr";
import useSWRInfinite from "swr/infinite";

const getKey = (pageIndex: number, previousPageData: any) => {
  const apiKey = "REDACTED";
  const baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=true&language=en-US&sort_by=popularity.desc&api_key=${apiKey}`;

  if (previousPageData && !previousPageData.length) return null; // reached the end
  return `${baseUrl}&page=${pageIndex + 1}`; // SWR key
};

export const useFetchMoviesIdList = () => {
  const fetcher: Fetcher<APIMoviesList> = (url: string) =>
    fetch(url).then((r) => r.json());
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);

  const idList = data ? data[0].results.map((result) => result.id) : [];

  return { data: idList, size, setSize };
};
