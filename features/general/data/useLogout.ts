import {
  useRevalidateByPattern,
  useSWRMutationConfigured,
} from "@/features/common/data/swr/hooks";
import { clearTokens } from "@/features/general/data/utils/clear-tokens";

type LogoutResDto = {
  successful: boolean;
};

export const useLogout = () => {
  const url = "/auth/logout";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    undefined,
    LogoutResDto
  >(url);

  const { revalidateByPattern } = useRevalidateByPattern();

  const trigger = async () => {
    return swrTrigger(
      { method: "POST" },
      {
        onSuccess: async () => {
          await clearTokens();
          await revalidateByPattern(undefined, undefined, { revalidate: true });
        },
      },
    );
  };
  return { trigger, ...rest };
};
