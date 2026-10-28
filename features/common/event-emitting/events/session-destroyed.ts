import { Emitter } from "@/features/common/event-emitting/emitter";
import { queryClient } from "@/features/common/data/query/client";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

export const useSessionDestroyed = () => {
  const posthog = usePostHog();

  useEffect(() => {
    const handleUnregistration = async () => {
      void queryClient.resetQueries();

      try {
        await posthog.register({
          is_guest: true,
        });
        console.log("✅ Session destroyed event processed");
      } catch (error) {
        console.error("❌ Error tracking session destroyed: ", error);
      }
    };
    Emitter.on("sessionDestroyed", handleUnregistration);

    return () => {
      Emitter.off("sessionDestroyed", handleUnregistration);
    };
  }, [posthog]);
};
