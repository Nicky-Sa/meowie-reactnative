import { VerifyOtpReqDto, AuthResDto } from "@/features/auth/dto/auth.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { createSession } from "@/features/common/data/utils/session";
import { useRevalidateAuth } from "@/features/general/data/use-revalidate-auth";
import { useSyncTaste } from "@/features/taste/data/use-sync-taste";

export const useVerifyOtp = () => {
  const url = "/auth/otp/verify";

  const { mutateAsync, ...rest } = useMutationConfigured<
    VerifyOtpReqDto,
    AuthResDto
  >(url);
  const { revalidateAuth } = useRevalidateAuth();
  const { syncTaste } = useSyncTaste();

  const trigger = async (body: VerifyOtpReqDto) => {
    const response = await mutateAsync({ method: "POST", body });
    await createSession({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    await revalidateAuth();
    // Sync any pending taste data from a guest taste flow (handles error internally)
    await syncTaste();

    return response.data;
  };
  return { trigger, ...rest };
};
