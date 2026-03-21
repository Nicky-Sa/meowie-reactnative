import * as SecureStore from "expo-secure-store";
import { Emitter } from "@/features/common/event-emitting/emitter";

export const clearTokens = async () => {
  // Delete tokens first
  await SecureStore.deleteItemAsync("access-token");
  await SecureStore.deleteItemAsync("refresh-token");
  // Then emit event to take care of side effects
  Emitter.emit("userUnregistered");
  console.log("Cleared tokens");
};
