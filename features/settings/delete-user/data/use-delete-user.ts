import {
  DeleteUserReqDto,
  DeleteUserResDto,
} from "@/features/settings/delete-user/data/dto/delete-user.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { destroySession } from "@/features/common/data/utils/session";
import { queryClient } from "@/features/common/data/query/client";
import { useResetFirstUseState } from "@/features/settings/delete-user/hooks/use-reset-first-use-state";
import Toast from "react-native-toast-message";

export const useDeleteUser = () => {
  const url = "/user/current";

  const { mutateAsync, ...rest } = useMutationConfigured<
    DeleteUserReqDto,
    DeleteUserResDto
  >(url);

  const resetFirstUseState = useResetFirstUseState();

  const deleteUser = async (body: DeleteUserReqDto) => {
    const response = await mutateAsync({ method: "DELETE", body });
    await destroySession();
    queryClient.clear();

    // resetting user-related items
    resetFirstUseState();

    Toast.show({
      type: "info",
      text1: "Your account has been deleted successfully.",
    });

    return response.data;
  };
  return { deleteUser, ...rest };
};
