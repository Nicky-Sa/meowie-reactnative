import {
  DeleteUserReqDto,
  DeleteUserResDto,
} from "@/features/settings/delete-user/data/dto/delete-user.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { destroySession } from "@/features/common/data/utils/destroy-session";

export const useDeleteUser = () => {
  const url = "/user/current";

  const { mutateAsync, ...rest } = useMutationConfigured<
    DeleteUserReqDto,
    DeleteUserResDto
  >(url);

  const trigger = async (body: DeleteUserReqDto) => {
    const response = await mutateAsync({ method: "DELETE", body });
    await destroySession();
    return response.data;
  };
  return { trigger, ...rest };
};
