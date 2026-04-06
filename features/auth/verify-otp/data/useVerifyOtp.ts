import {
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "@/features/auth/verify-otp/data/dto/verify-otp.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { registerUser } from "@/features/common/data/utils/register-user";
import { useRevalidateAuth } from "@/features/general/data/useRevalidateAuth";

export const useVerifyOtp = () => {
  const url = "/auth/verify-otp";

  const { mutateAsync, ...rest } = useMutationConfigured<
    VerifyOtpReqDto,
    VerifyOtpResDto
  >(url);
  const { revalidateAuth } = useRevalidateAuth();

  const trigger = async (body: VerifyOtpReqDto) => {
    const response = await mutateAsync({ method: "POST", body });
    await registerUser({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    await revalidateAuth();
    return response;
  };
  return { trigger, ...rest };
};
