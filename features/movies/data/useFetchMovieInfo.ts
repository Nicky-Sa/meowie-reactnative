import { MovieInfoResDto } from "@/features/movies/data/dto/movies.dto";
import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchMovieInfo = (id: ID) => {
  const url = `/movie/info/${id}`;
  const { data: response, ...rest } = useSWRConfigured<MovieInfoResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
