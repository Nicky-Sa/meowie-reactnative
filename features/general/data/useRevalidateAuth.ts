import { useCallback } from "react";
import { useRevalidateByPattern } from "@/features/common/data/swr/hooks";

const authRequiredPaths = [
  new RegExp("/auth/current-user"),
  new RegExp("^/library/saved/.*"),
];

export const useRevalidateAuth = () => {
  const { revalidateByPattern } = useRevalidateByPattern();

  const revalidateAuth = useCallback(async () => {
    // Manually iterate keys to avoid the internal SWR iterator crash
    for (const path of authRequiredPaths) {
      await revalidateByPattern(path);
    }
    console.log("Revalidated auth required paths");
  }, [revalidateByPattern]);

  return { revalidateAuth };
};
