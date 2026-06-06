import { MovieInfoResDto } from "@/features/media/movie/data/dto/movies.dto";
import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchMovieInfo = (id: ID) => {
  const url = `/movie/${id}`;
  const { data: response, ...rest } = useQueryConfigured<MovieInfoResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
