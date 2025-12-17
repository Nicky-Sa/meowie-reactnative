import useSWR from "swr";
import { MovieInfoResDto } from "@/features/movies/movies-info/data/dto/movies.dto";
import { SuccessResponse } from "@/features/common/data/transformers";

export const useFetchMovieInfo = (id: number) => {
  const dummyId = id < 0;
  const url = !dummyId ? `/movies/info/${id}` : null;
  const { data: response, ...rest } = useSWR<
    SuccessResponse<MovieInfoResDto>,
    Error
  >(url);
  return {
    data: response?.data,
    ...rest,
  };
};
