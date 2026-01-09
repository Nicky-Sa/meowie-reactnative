import * as SecureStore from "expo-secure-store";
import { Emitter } from "@/features/common/event-emitting/emitter";

type Tokens = {
  accessToken: string;
  refreshToken: string;
  userId: number;
};
export const setTokens = async ({
  accessToken,
  refreshToken,
  userId,
}: Tokens) => {
  await SecureStore.setItemAsync("access-token", accessToken);
  await SecureStore.setItemAsync("refresh-token", refreshToken);
  Emitter.emit("userRegistered", { userId });
};
