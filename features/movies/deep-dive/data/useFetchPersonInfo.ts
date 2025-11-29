import useSWR from "swr";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import { PersonResDto } from "@/features/movies/deep-dive/data/person.dto";

export const useFetchPersonInfo = (id: number) => {
  const url = `/person/${id}`;
  const { data: response, ...rest } = useSWR<
    SuccessResponse<PersonResDto>,
    Error
  >(url, fetcher);
  return {
    data: response?.data,
    ...rest,
  };
};
