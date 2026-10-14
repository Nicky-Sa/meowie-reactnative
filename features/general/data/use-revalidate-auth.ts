import { useCallback } from "react";
import { useInvalidateByPattern } from "@/features/common/data/query/hooks";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useAfterLogin } from "@/features/general/data/use-after-login";

const authRequiredPaths = [new RegExp("/library/.*")];

export const useRevalidateAuth = () => {
  const { invalidateByPattern } = useInvalidateByPattern();
  const { refetch: refetchCurrentUser } = useCurrentUser();
  const { afterLogin } = useAfterLogin();

  const revalidateAuth = useCallback(async () => {
    const { data: currentUserResponse } = await refetchCurrentUser({
      throwOnError: true,
    });

    // Invalidate each auth-required path pattern
    for (const path of authRequiredPaths) {
      await invalidateByPattern(path);
    }
    if (currentUserResponse?.data.user) {
      await afterLogin();
    }
    console.log("Revalidated auth required paths");
  }, [refetchCurrentUser, invalidateByPattern, afterLogin]);

  return { revalidateAuth };
};
