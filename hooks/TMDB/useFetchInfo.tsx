import { TMDB_RequiredInfo } from "@/models/tmdb/info";
import { OMDB_RequiredInfo } from "@/models/omdb/info";
import useSWR, { Fetcher } from "swr";

export const useFetchInfo = (id: number, shouldFetch: boolean) => {
  const fetcher: Fetcher<TMDB_RequiredInfo & OMDB_RequiredInfo> = (
    url: string,
  ) => fetch(url).then((r) => r.json());
  const url = shouldFetch
    ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/movies/${id}`
    : null;
  const result = useSWR(url, fetcher);

  return { ...result };
};
