import { useSWRConfig } from "swr";
import { useCallback } from "react";

export const useEmptySWRCache = () => {
  const { cache, mutate } = useSWRConfig();

  const clearSWRCache = useCallback(async () => {
    const allKeys = Array.from(cache.keys());

    allKeys.forEach((key) => {
      cache.delete(key);
    });

    // Clear the in-memory state for active hooks
    await mutate(() => true, undefined, { revalidate: false });
  }, [cache, mutate]);

  return { clearSWRCache };
};
