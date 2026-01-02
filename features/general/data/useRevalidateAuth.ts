import { useSWRConfig } from "swr";
import { useCallback } from "react";

export const authRequiredPaths = [
  "/auth/current-user",
  "/movie-states",
] as const;

export const useRevalidateAuth = () => {
  const { mutate } = useSWRConfig();

  const revalidate = useCallback(async () => {
    // The filter function iterates through all keys in the SWR cache
    await mutate((key) => {
      // SWR keys can be strings or arrays. Extract the base URL.
      const keyString = Array.isArray(key) ? key[0] : key;

      if (typeof keyString !== "string") return false;

      // Check if the current cache key includes any of our restricted paths
      return authRequiredPaths.some((path) => keyString.includes(path));
    });
    console.log("Revalidated auth");
  }, [mutate]);

  return { revalidate };
};
