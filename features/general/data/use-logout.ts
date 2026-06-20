import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { destroySession } from "@/features/common/data/utils/session";
import { queryClient } from "@/features/common/data/query/client";

type LogoutResDto = {
  successful: boolean;
};

export const useLogout = () => {
  const url = "/auth/logout";

  const { mutateAsync, ...rest } = useMutationConfigured<
    undefined,
    LogoutResDto
  >(url);

  const trigger = async () => {
    const response = await mutateAsync({ method: "POST" });
    await destroySession();
    queryClient.clear();
    return response.data;
  };
  return { trigger, ...rest };
};
