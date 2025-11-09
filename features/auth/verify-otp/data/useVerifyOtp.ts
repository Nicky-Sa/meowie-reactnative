import { SuccessResponse } from "@/features/common/data/dto/success.dto";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import useSWRMutation from "swr/mutation";
import {
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "@/features/auth/verify-otp/data/dto/verify-otp.dto";

export const useVerifyOtp = () => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/verify-otp`;

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
