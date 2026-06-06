import { VerifyOtpReqDto, AuthResDto } from "@/features/auth/dto/auth.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { createSession } from "@/features/common/data/utils/create-session";
import { useRevalidateAuth } from "@/features/general/data/use-revalidate-auth";

export const useVerifyOtp = () => {
  const url = "/auth/otp/verify";

  const { mutateAsync, ...rest } = useMutationConfigured<
    VerifyOtpReqDto,
    AuthResDto
  >(url);
  const { revalidateAuth } = useRevalidateAuth();

  const trigger = async (body: VerifyOtpReqDto) => {
    const response = await mutateAsync({ method: "POST", body });
    await createSession({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    await revalidateAuth();
    return response.data;
  };
  return { trigger, ...rest };
};
