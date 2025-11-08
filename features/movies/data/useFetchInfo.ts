import useSWR from "swr";
import { MoviesResDto } from "@/features/movies/data/dto/movies.dto";
import { SuccessResponse } from "@/features/general/dto/success.dto";
import { fetcher } from "@/features/common/data/fetcher";

export const useFetchInfo = (id: number) => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/movies/${id}`;
  const { data: response, ...rest } = useSWR<
    SuccessResponse<MoviesResDto>,
    Error
  >(url, fetcher);
  return {
    data: response?.data,
    ...rest,
  };
};
