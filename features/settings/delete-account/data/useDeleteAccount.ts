import {
  DeleteAccountReqDto,
  DeleteAccountResDto,
} from "@/features/settings/delete-account/data/dto/delete-account.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { unregisterUser } from "@/features/common/data/utils/unregister-user";

export const useDeleteAccount = () => {
  const url = "/auth/delete-account";

  const { mutateAsync, ...rest } = useMutationConfigured<
    DeleteAccountReqDto,
    DeleteAccountResDto
  >(url);

  const trigger = async (body: DeleteAccountReqDto) => {
    const response = await mutateAsync({ method: "POST", body });
    await unregisterUser();
    return response;
  };
  return { trigger, ...rest };
};
