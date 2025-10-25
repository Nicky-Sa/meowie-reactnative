import useSWR, { Fetcher } from "swr";
import { MoviesResDTO } from "@/components/movies/data/dto/movies.dto";
import { Success } from "@/components/general/dto/success.dto";

export const useFetchInfo = (id: number) => {
  const fetcher: Fetcher<Success<MoviesResDTO>> = (url: string) =>
    fetch(url).then((r) => r.json());
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/movies/${id}`;
  return useSWR(url, fetcher);
};
