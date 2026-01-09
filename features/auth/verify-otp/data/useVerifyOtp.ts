import {
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "@/features/auth/verify-otp/data/dto/verify-otp.dto";
import { useSWRMutationConfigured } from "@/features/common/data/swr/hooks";
import { setTokens } from "@/features/general/data/utils/set-tokens";
import { useRevalidateAuth } from "@/features/general/data/useRevalidateAuth";

export const useVerifyOtp = () => {
  const url = "/auth/verify-otp";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    VerifyOtpReqDto,
    VerifyOtpResDto
  >(url);
  const { revalidateAuth } = useRevalidateAuth();

  const trigger = async (body: VerifyOtpReqDto) => {
    return swrTrigger(
      { method: "POST", body },
      {
        onSuccess: async (response) => {
          await setTokens({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });
          await revalidateAuth();
        },
      },
    );
  };
  return { trigger, ...rest };
};
