import { useSWRMutationConfigured } from "@/features/common/data/swr-config";

type LogoutResDto = {
  successful: boolean;
};

export const useLogout = () => {
  const url = "/auth/logout";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    undefined,
    LogoutResDto
  >(url);

  const trigger = async () => {
    return swrTrigger({ method: "POST" });
  };
  return { trigger, ...rest };
};
