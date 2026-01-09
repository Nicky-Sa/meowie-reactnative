import * as SecureStore from "expo-secure-store";
import { globalSWRCache } from "@/features/common/data/swr/cache";

export const clearTokens = async () => {
  // Delete tokens first
  await SecureStore.deleteItemAsync("access-token");
  await SecureStore.deleteItemAsync("refresh-token");
  // Then empty the cache
  globalSWRCache.empty();
  console.log("Cleared tokens");
};
