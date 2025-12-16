import useSWR from "swr";
import { MovieInfoResDto } from "@/features/movies/movie-info/data/dto/movies.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

export const useFetchMovieInfo = (id: number) => {
  const url = `/movies/info/${id}`;
  const { data: response, ...rest } = useSWR<
    SuccessResponse<MovieInfoResDto>,
    Error
  >(url);
  return {
    data: response?.data,
    ...rest,
  };
};
