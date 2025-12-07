import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Emitter } from "@/features/common/event-emitting/emitter";
import * as SecureStore from "expo-secure-store";

export const useLogoutEvent = () => {
  const router = useRouter();

  useEffect(() => {
    const subscription = Emitter.addListener("clearTokens", async () => {
      console.log("Clear tokens event received, deleting tokens...");
      await SecureStore.deleteItemAsync("access-token");
      await SecureStore.deleteItemAsync("refresh-token");
    });

    return () => {
      subscription.remove();
    };
  }, [router]);
};
