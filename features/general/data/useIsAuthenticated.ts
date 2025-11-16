import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher } from "@/features/common/data/fetcher";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

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

export const useIsAuthenticatedTrigger = () => {
  const url = "/auth/is-authenticated";

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<{ isAuthenticated: boolean }>,
    Error,
    string
  >(url, fetcher);

  const trigger = async () => {
    return swrTrigger();
  };

  return {
    trigger,
    ...rest,
  };
};
