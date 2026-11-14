import { Emitter } from "@/features/common/event-emitting/emitter";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

export const useSessionCreated = () => {
  const posthog = usePostHog();

  useEffect(() => {
    const handleRegistration = async () => {
      try {
        await posthog.register({
          is_guest: false,
        });
        console.log("✅ Session created event processed");
      } catch (error) {
        console.error("❌ Error tracking session created: ", error);
      }
    };

    // handleRegistration catches its own errors, so its promise is safe to drop.
    const onSessionCreated = () => void handleRegistration();

    Emitter.on("sessionCreated", onSessionCreated);

    return () => {
      Emitter.off("sessionCreated", onSessionCreated);
    };
  }, [posthog]);
};
