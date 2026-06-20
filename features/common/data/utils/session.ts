import { Emitter } from "@/features/common/event-emitting/emitter";
import {
  clearStoredTokens,
  setStoredTokens,
} from "@/features/common/data/utils/token";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const createSession = async ({ accessToken, refreshToken }: Tokens) => {
  await setStoredTokens(accessToken, refreshToken);
  Emitter.emit("sessionCreated");
};

export const destroySession = async () => {
  // Clear tokens first
  await clearStoredTokens();
  console.log("Cleared tokens");
  // Then emit event to take care of side effects
  Emitter.emit("sessionDestroyed");
};
