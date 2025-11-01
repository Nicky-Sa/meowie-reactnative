import useSWR from "swr";
import { MoviesResDTO } from "@/features/movies/data/dto/movies.dto";
import { SuccessResponse } from "@/features/general/dto/success.dto";
import { fetcher } from "@/features/movies/data/fetcher";

export const useFetchInfo = (id: number) => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/movies/${id}`;
  const { data: response, ...rest } = useSWR<SuccessResponse<MoviesResDTO>>(
    url,
    fetcher,
  );
  return {
    data: response?.data,
    ...rest,
  };
};
