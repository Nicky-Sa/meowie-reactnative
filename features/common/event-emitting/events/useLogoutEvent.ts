import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Emitter } from "@/features/common/event-emitting/emitter";

export const useLogoutEvent = () => {
  const router = useRouter();

  useEffect(() => {
    const subscription = Emitter.addListener("logout", () => {
      console.log("Logout event received, navigating to login...");
      router.replace("/auth/request-otp");
    });

    return () => {
      subscription.remove();
    };
  }, [router]);
};
