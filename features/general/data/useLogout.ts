import useSWRMutation from "swr/mutation";
import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";

type LogoutResDto = {
  successful: boolean;
};

export const useLogout = () => {
  const url = "/auth/logout";

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<LogoutResDto>,
    Error,
    string,
    MutationArg<undefined>
  >(url, fetcher);

  const trigger = async () => {
    return swrTrigger({ method: "POST" });
  };
  return { trigger, ...rest };
};
