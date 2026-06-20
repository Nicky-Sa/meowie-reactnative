import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { destroySession } from "@/features/common/data/utils/session";

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
    await destroySession();
    await invalidateByPattern(); // Invalidate all queries
    return response.data;
  };
  return { trigger, ...rest };
};
