import * as SecureStore from "expo-secure-store";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};
export const setTokens = async ({ accessToken, refreshToken }: Tokens) => {
  await SecureStore.setItemAsync("access-token", accessToken);
  await SecureStore.setItemAsync("refresh-token", refreshToken);
};
