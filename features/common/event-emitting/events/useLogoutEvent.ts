import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Emitter } from "@/features/common/event-emitting/emitter";
import * as SecureStore from "expo-secure-store";
import { useLogout } from "@/features/general/data/useLogout";

export const useLogoutEvent = () => {
  const router = useRouter();
  const { trigger: triggerLogout } = useLogout();

  useEffect(() => {
    const subscription = Emitter.addListener("logout", async () => {
      console.log(
        "Logout event received, deleting tokens, navigating to login...",
      );
      await triggerLogout();
      await SecureStore.deleteItemAsync("access-token");
      await SecureStore.deleteItemAsync("refresh-token");
      router.replace("/auth/request-otp");
    });

    return () => {
      subscription.remove();
    };
  }, [router, triggerLogout]);
};
