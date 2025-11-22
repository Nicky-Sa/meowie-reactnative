import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import useSWRMutation from "swr/mutation";
import { DeleteAccountReqDto } from "@/features/settings/delete-account/data/dto/delete-account.dto";

export const useDeleteAccount = () => {
  const url = "/auth/delete-account";

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<undefined>,
    Error,
    string,
    MutationArg<DeleteAccountReqDto>
  >(url, fetcher);

  const trigger = async (body: DeleteAccountReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
