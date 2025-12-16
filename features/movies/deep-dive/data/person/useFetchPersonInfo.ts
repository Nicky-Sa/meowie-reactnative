import useSWR from "swr";
import { SuccessResponse } from "@/features/common/data/transformers";
import { PersonResDto } from "@/features/movies/deep-dive/data/person/person.dto";

export const useFetchPersonInfo = (id: number) => {
  const url = `/person/${id}`;
  const { data: response, ...rest } = useSWR<
    SuccessResponse<PersonResDto>,
    Error
  >(url);
  return {
    data: response?.data,
    ...rest,
  };
};
