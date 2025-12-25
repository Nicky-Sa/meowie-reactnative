import { PersonResDto } from "@/features/person/data/person/person.dto";
import { useSWRConfigured } from "@/features/common/data/swr-config";

export const useFetchPersonInfo = (id: number) => {
  const url = `/person/${id}`;
  const { data: response, ...rest } = useSWRConfigured<PersonResDto>(url);
  return {
    data: response?.data,
    ...rest,
  };
};
