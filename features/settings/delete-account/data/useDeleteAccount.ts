import {
  DeleteAccountReqDto,
  DeleteAccountResDto,
} from "@/features/settings/delete-account/data/dto/delete-account.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { destroySession } from "@/features/common/data/utils/destroy-session";

export const useDeleteAccount = () => {
  const url = "/auth/delete-account";

  const { mutateAsync, ...rest } = useMutationConfigured<
    DeleteAccountReqDto,
    DeleteAccountResDto
  >(url);

  const trigger = async (body: DeleteAccountReqDto) => {
    const response = await mutateAsync({ method: "POST", body });
    await destroySession();
    return response;
  };
  return { trigger, ...rest };
};
