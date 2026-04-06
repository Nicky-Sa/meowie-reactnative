import * as SecureStore from "expo-secure-store";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const getAccessToken = async (): Promise<string | null> => {
  if (accessToken) return accessToken;
  accessToken = await SecureStore.getItemAsync("access-token");
  return accessToken;
};

export const getRefreshToken = async (): Promise<string | null> => {
  if (refreshToken) return refreshToken;
  refreshToken = await SecureStore.getItemAsync("refresh-token");
  return refreshToken;
};

export const setStoredTokens = async (
  newAccessToken: string,
  newRefreshToken: string,
): Promise<void> => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  await SecureStore.setItemAsync("access-token", newAccessToken);
  await SecureStore.setItemAsync("refresh-token", newRefreshToken);
};

export const clearStoredTokens = async (): Promise<void> => {
  accessToken = null;
  refreshToken = null;
  await SecureStore.deleteItemAsync("access-token");
  await SecureStore.deleteItemAsync("refresh-token");
};
