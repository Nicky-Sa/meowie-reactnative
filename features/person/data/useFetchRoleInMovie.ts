import { RoleInMovieResDto } from "@/features/person/data/person.dto";
import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/query";

export const useFetchRoleInMovie = (
  personId: ID | undefined,
  movieId: ID | undefined,
) => {
  const url =
    personId && movieId ? `/person/${personId}/role/${movieId}` : null;
  const { data: response, ...rest } = useSWRConfigured<RoleInMovieResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
