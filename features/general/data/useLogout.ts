import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { unregisterUser } from "@/features/common/data/utils/unregister-user";

type LogoutResDto = {
  successful: boolean;
};

export const useLogout = () => {
  const url = "/auth/logout";

  const { mutateAsync, ...rest } = useMutationConfigured<
    undefined,
    LogoutResDto
  >(url);

  const { invalidateByPattern } = useInvalidateByPattern();

  const trigger = async () => {
    const response = await mutateAsync({ method: "POST" });
    await unregisterUser();
    await invalidateByPattern(); // Invalidate all queries
    return response;
  };
  return { trigger, ...rest };
};
