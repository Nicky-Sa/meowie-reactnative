import {
  useInvalidateByPattern,
  useMutationConfigured,
} from "@/features/common/data/query/hooks";
import { clearTokens } from "@/features/general/data/utils/clear-tokens";

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
    await clearTokens();
    await invalidateByPattern(); // Invalidate all queries
    return response;
  };
  return { trigger, ...rest };
};
