import { MovieDetailsResDto } from "@/features/media/movie/data/dto/movies.dto";
import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchMovieDetails = (id: ID) => {
  const url = `/movie/${id}`;
  const { data: response, ...rest } =
    useQueryConfigured<MovieDetailsResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
