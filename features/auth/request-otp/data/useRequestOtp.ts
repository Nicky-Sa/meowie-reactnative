import { SuccessResponse } from "@/features/common/data/dto/success.dto";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import {
  RequestOtpReqDto,
  RequestOtpResDto,
} from "@/features/auth/request-otp/data/dto/request-otp.dto";
import useSWRMutation from "swr/mutation";

export const useRequestOtp = () => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/request-otp`;

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<RequestOtpResDto>,
    Error,
    string,
    MutationArg<RequestOtpReqDto>
  >(url, fetcher);

  const trigger = async (body: RequestOtpReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
