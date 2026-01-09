import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/query";
import { MovieStatesResDto } from "@/features/common/movies-list/details/elements/bookmark/data/dto/movie-states.dto";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";

type Args = {
  id: ID;
};

/**
 * Fetches the movie states for the given movie id.
 * @note Protected route: If the user is not logged in, it won't fetch anything.
 * @param id
 */
export const useFetchMovieStates = ({ id }: Args) => {
  const { data } = useCurrentUser();
  const url = data?.user ? `/movie-states/${id}` : null;
  const { data: response, ...rest } = useSWRConfigured<MovieStatesResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
