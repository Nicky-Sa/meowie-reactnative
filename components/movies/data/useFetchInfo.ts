import useSWR, { Fetcher } from "swr";
import { TMDB_RequiredInfo } from "@/models/tmdb/info";
import { AllRatings } from "@/models/ratings";
import { PrimaryColor } from "@/models/color";

export const useFetchInfo = (id: number) => {
  const fetcher: Fetcher<TMDB_RequiredInfo & AllRatings & PrimaryColor> = (
    url: string,
  ) => fetch(url).then((r) => r.json());
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/movies/${id}`;
  return useSWR(url, fetcher);
};
