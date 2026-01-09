import { useCallback } from "react";
import { useRevalidateByPattern } from "@/features/common/data/swr/hooks";

export const authRequiredPaths = [
  "/auth/current-user",
  "/movie-states",
] as const;

export const useRevalidateAuth = () => {
  const { revalidateByPattern } = useRevalidateByPattern();

  const revalidateAuth = useCallback(async () => {
    // Manually iterate keys to avoid the internal SWR iterator crash
    for (const path of authRequiredPaths) {
      await revalidateByPattern(path);
    }
    console.log("Revalidated auth");
  }, [revalidateByPattern]);

  return { revalidateAuth };
};
