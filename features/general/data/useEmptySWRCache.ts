import { useCallback } from "react";
import {
  useRevalidateByPattern,
  useSWRConfigTyped,
} from "@/features/common/data/swr/hooks";

export const useEmptySWRCache = () => {
  const { revalidateByPattern } = useRevalidateByPattern();
  const { cache } = useSWRConfigTyped();

  const clearSWRCache = useCallback(async () => {
    try {
      // Revalidate all keys and then delete them from the cache to fully clear
      await revalidateByPattern(undefined, undefined);
      cache.clear();
    } catch (error) {
      console.log({ error });
    }
  }, [revalidateByPattern, cache]);

  return { clearSWRCache };
};
