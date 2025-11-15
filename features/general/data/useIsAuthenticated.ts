import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import useSWR from "swr";

export const useIsAuthenticated = () => {
  const url = "/auth/is-authenticated";

  const { data: response, ...rest } = useSWR<
    SuccessResponse<{ isAuthenticated: boolean }>,
    Error,
    string
  >(url, fetcher);

  return {
    data: response?.data,
    ...rest,
  };
};
