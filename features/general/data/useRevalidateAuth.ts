import { useCallback } from "react";
import { useInvalidateByPattern } from "@/features/common/data/query/hooks";

const authRequiredPaths = [
  new RegExp("/auth/current-user"),
  new RegExp("/library/.*"),
];

export const useRevalidateAuth = () => {
  const { invalidateByPattern } = useInvalidateByPattern();

  const revalidateAuth = useCallback(async () => {
    // Invalidate each auth-required path pattern
    for (const path of authRequiredPaths) {
      await invalidateByPattern(path);
    }
    console.log("Revalidated auth required paths");
  }, [invalidateByPattern]);

  return { revalidateAuth };
};
