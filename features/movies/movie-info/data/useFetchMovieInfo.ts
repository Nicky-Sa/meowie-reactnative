import useSWR from "swr";
import { MoviesResDto } from "@/features/movies/movie-info/data/dto/movies.dto";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";

export const useFetchMovieInfo = (id: number) => {
  const url = `/movies/${id}`;
  const { data: response, ...rest } = useSWR<
    SuccessResponse<MoviesResDto>,
    Error
  >(url, fetcher);
  return {
    data: response?.data,
    ...rest,
  };
};
