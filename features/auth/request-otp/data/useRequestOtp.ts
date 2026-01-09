import { RequestOtpReqDto } from "@/features/auth/request-otp/data/dto/request-otp.dto";
import { useSWRMutationConfigured } from "@/features/common/data/swr/hooks";

export const useRequestOtp = () => {
  const url = "/auth/request-otp";

  const { trigger: swrTrigger, ...rest } = useSWRMutationConfigured<
    RequestOtpReqDto,
    undefined
  >(url);

  const trigger = async (body: RequestOtpReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
