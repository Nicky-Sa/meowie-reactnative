import {
  DeleteAccountReqDto,
  DeleteAccountResDto,
} from "@/features/settings/delete-account/data/dto/delete-account.dto";
import { useSWRMutationConfigured } from "@/features/common/data/swr-config";

export const useDeleteAccount = () => {
  const url = "/auth/delete-account";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    DeleteAccountReqDto,
    DeleteAccountResDto
  >(url);

  const trigger = async (body: DeleteAccountReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
