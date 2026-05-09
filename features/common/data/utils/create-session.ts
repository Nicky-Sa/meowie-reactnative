import { Emitter } from "@/features/common/event-emitting/emitter";
import { setStoredTokens } from "@/features/common/data/utils/token-storage";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const createSession = async ({ accessToken, refreshToken }: Tokens) => {
  await setStoredTokens(accessToken, refreshToken);
  Emitter.emit("sessionCreated");
};
