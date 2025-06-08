import useSWR, { Fetcher } from "swr";
import { MoviesDTO } from "@/components/movies/models/movies.dto";

export const useFetchInfo = (id: number) => {
  const fetcher: Fetcher<MoviesDTO> = (url: string) =>
    fetch(url).then((r) => r.json());
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/movies/${id}`;
  return useSWR(url, fetcher);
};
