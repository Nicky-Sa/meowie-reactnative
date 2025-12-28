import {
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "@/features/auth/verify-otp/data/dto/verify-otp.dto";
import { useSWRMutationConfigured } from "@/features/common/data/swr-config";

export const useVerifyOtp = () => {
  const url = "/auth/verify-otp";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    VerifyOtpReqDto,
    VerifyOtpResDto
  >(url);

  const trigger = async (body: VerifyOtpReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
