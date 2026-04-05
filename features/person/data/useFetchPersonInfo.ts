import { PersonResDto } from "@/features/person/data/person.dto";
import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchPersonInfo = (id: ID) => {
  const url = `/person/${id}`;
  const { data: response, ...rest } = useQueryConfigured<PersonResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
