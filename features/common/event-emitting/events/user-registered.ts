import { Emitter } from "@/features/common/event-emitting/emitter";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

export const useUserRegistered = () => {
  const posthog = usePostHog();

  useEffect(() => {
    const listener = Emitter.addListener("userRegistered", async () => {
      try {
        await posthog.register({
          is_guest: false,
        });
        console.log("User registered event processed");
      } catch (error) {
        console.log("Error tracking user registered: ", error);
      }
    });

    return () => {
      listener.remove();
    };
  }, [posthog]);
};
