import { PersonResDto } from "@/features/person/data/person.dto";
import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/media-query";

export const useFetchPersonInfo = (id: ID) => {
  const url = `/person/${id}`;
  const { data: response, ...rest } = useSWRConfigured<PersonResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
