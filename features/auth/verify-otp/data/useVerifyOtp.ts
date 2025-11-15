import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import useSWRMutation from "swr/mutation";
import {
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "@/features/auth/verify-otp/data/dto/verify-otp.dto";

export const useVerifyOtp = () => {
  const url = "/auth/verify-otp";

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<VerifyOtpResDto>,
    Error,
    string,
    MutationArg<VerifyOtpReqDto>
  >(url, fetcher);

  const trigger = async (body: VerifyOtpReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
