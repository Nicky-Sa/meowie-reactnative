import { Emitter } from "@/features/common/event-emitting/emitter";
import { clearStoredTokens } from "@/features/common/data/utils/token-storage";

export const destroySession = async () => {
  // Clear tokens first
  await clearStoredTokens();
  console.log("Cleared tokens");
  // Then emit event to take care of side effects
  Emitter.emit("sessionDestroyed");
};
