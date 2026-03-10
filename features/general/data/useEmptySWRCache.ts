import { useCallback } from "react";
import { useRevalidateByPattern } from "@/features/common/data/swr/hooks";

export const useEmptySWRCache = () => {
  const { revalidateByPattern } = useRevalidateByPattern();

  const clearSWRCache = useCallback(async () => {
    try {
      // Clear the in-memory state for active hooks
      await revalidateByPattern(undefined, undefined, { revalidate: true });
    } catch (error) {
      console.log({ error });
    }
  }, [revalidateByPattern]);

  return { clearSWRCache };
};
