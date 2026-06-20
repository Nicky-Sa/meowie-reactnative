import * as SecureStore from "expo-secure-store";
import { SECURE_STORE_KEYS } from "@/features/common/data/utils/storage-keys";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const getAccessToken = async (): Promise<string | null> => {
  if (accessToken) return accessToken;
  accessToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
  return accessToken;
};

export const getRefreshToken = async (): Promise<string | null> => {
  if (refreshToken) return refreshToken;
  refreshToken = await SecureStore.getItemAsync(
    SECURE_STORE_KEYS.REFRESH_TOKEN,
  );
  return refreshToken;
};

export const setStoredTokens = async (
  newAccessToken: string,
  newRefreshToken: string,
): Promise<void> => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  await SecureStore.setItemAsync(
    SECURE_STORE_KEYS.ACCESS_TOKEN,
    newAccessToken,
  );
  await SecureStore.setItemAsync(
    SECURE_STORE_KEYS.REFRESH_TOKEN,
    newRefreshToken,
  );
};

export const clearStoredTokens = async (): Promise<void> => {
  accessToken = null;
  refreshToken = null;
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
};
