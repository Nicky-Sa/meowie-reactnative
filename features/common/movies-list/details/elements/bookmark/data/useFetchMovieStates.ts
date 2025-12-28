import { useSWRConfigured } from "@/features/common/data/swr-config";
import { ID } from "@/features/common/data/query";
import { MovieStatesResDto } from "@/features/common/movies-list/details/elements/bookmark/data/dto/movie-states.dto";

type Args = {
  id: ID;
};

export const useFetchMovieStates = ({ id }: Args) => {
  const url = `/movie-states/${id}`;
  const { data: response, ...rest } = useSWRConfigured<MovieStatesResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
