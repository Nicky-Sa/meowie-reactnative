import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import useSWR from "swr";
import { User } from "@/entities/user";

type CurrentUserResDto = {
  user: User | null;
};

export const useCurrentUser = () => {
  const url = "/auth/current-user";

  const { data: response, ...rest } = useSWR<
    SuccessResponse<CurrentUserResDto>,
    Error
  >(url, fetcher);

  return {
    data: response?.data,
    ...rest,
  };
};
