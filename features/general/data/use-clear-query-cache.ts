import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useClearQueryCache = () => {
  const queryClient = useQueryClient();

  const clearCache = useCallback(async () => {
    // Invalidate all queries and then clear the cache
    await queryClient.invalidateQueries();
    queryClient.clear();
  }, [queryClient]);

  return { clearCache };
};
