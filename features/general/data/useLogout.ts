import { useSWRMutationConfigured } from "@/features/common/data/swr/hooks";
import { clearTokens } from "@/features/general/data/utils/clear-tokens";
import { usePostHog } from "posthog-react-native";

type LogoutResDto = {
  successful: boolean;
};

export const useLogout = () => {
  const url = "/auth/logout";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    undefined,
    LogoutResDto
  >(url);

  const posthog = usePostHog();

  const trigger = async () => {
    return swrTrigger(
      { method: "POST" },
      {
        onSuccess: async () => {
          await clearTokens();
          posthog.reset();
        },
      },
    );
  };
  return { trigger, ...rest };
};
