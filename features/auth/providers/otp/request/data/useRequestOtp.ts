import { RequestOtpReqDto } from "@/features/auth/dto/auth.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";

export const useRequestOtp = () => {
  const url = "/auth/request-otp";

  const { mutateAsync, ...rest } = useMutationConfigured<
    RequestOtpReqDto,
    undefined
  >(url);

  const trigger = async (body: RequestOtpReqDto) => {
    return mutateAsync({ method: "POST", body });
  };
  return { trigger, ...rest };
};
