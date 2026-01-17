import { Emitter } from "@/features/common/event-emitting/emitter";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

export const useUserRegistered = () => {
  const posthog = usePostHog();

  useEffect(() => {
    const handleRegistration = async () => {
      try {
        await posthog.register({
          is_guest: false,
        });
        console.log("✅ User registered event processed");
      } catch (error) {
        console.error("❌ Error tracking user registered: ", error);
      }
    };

    Emitter.on("userRegistered", handleRegistration);

    return () => {
      Emitter.off("userRegistered", handleRegistration);
    };
  }, [posthog]);
};
