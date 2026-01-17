import { Emitter } from "@/features/common/event-emitting/emitter";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

export const useUserUnregistered = () => {
  const posthog = usePostHog();

  useEffect(() => {
    const handleUnregistration = async () => {
      try {
        posthog.reset();

        await posthog.register({
          is_guest: true,
        });
        console.log("✅ User unregistered event processed");
      } catch (error) {
        console.log("❌ Error tracking user unregistered: ", error);
      }
    };
    Emitter.on("userUnregistered", handleUnregistration);

    return () => {
      Emitter.off("userUnregistered", handleUnregistration);
    };
  }, [posthog]);
};
