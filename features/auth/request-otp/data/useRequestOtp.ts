import { SuccessResponse } from "@/features/common/data/transformers";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { RequestOtpReqDto } from "@/features/auth/request-otp/data/dto/request-otp.dto";
import useSWRMutation from "swr/mutation";

export const useRequestOtp = () => {
  const url = "/auth/request-otp";

  const { trigger: swrTrigger, ...rest } = useSWRMutation<
    SuccessResponse<undefined>,
    Error,
    string,
    MutationArg<RequestOtpReqDto>
  >(url, fetcher);

  const trigger = async (body: RequestOtpReqDto) => {
    return swrTrigger({ method: "POST", body });
  };
  return { trigger, ...rest };
};
