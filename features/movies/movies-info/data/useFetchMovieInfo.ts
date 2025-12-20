import { MovieInfoResDto } from "@/features/movies/movies-info/data/dto/movies.dto";
import { useSWRConfigured } from "@/features/common/data/swr-config";

export const useFetchMovieInfo = (id: number) => {
  const dummyId = id < 0;
  const url = !dummyId ? `/movies/info/${id}` : null;
  const { data: response, ...rest } = useSWRConfigured<MovieInfoResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
