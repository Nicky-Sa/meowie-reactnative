import { RoleInMovieResDto } from "@/features/person/data/person.dto";
import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchRole = (
  personId: ID | undefined,
  mediaId: ID | undefined,
) => {
  const url =
    personId && mediaId ? `/person/${personId}/role/${mediaId}` : null;
  const { data: response, ...rest } = useSWRConfigured<RoleInMovieResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
