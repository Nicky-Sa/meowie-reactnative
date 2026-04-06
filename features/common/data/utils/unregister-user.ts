import { Emitter } from "@/features/common/event-emitting/emitter";
import { clearStoredTokens } from "@/features/common/data/utils/token-storage";

export const unregisterUser = async () => {
  // Clear tokens first
  await clearStoredTokens();
  // Then emit event to take care of side effects
  Emitter.emit("userUnregistered");
  console.log("Cleared tokens");
};
