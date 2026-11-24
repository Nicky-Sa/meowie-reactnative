import { Emitter } from "@/features/common/event-emitting/emitter";
import { queryClient } from "@/features/common/data/query/client";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";
import { useSavePushToken } from "@/features/general/notifications/data/use-save-push-token";

export const useSessionDestroyed = () => {
  const posthog = usePostHog();
  const { savePushToken } = useSavePushToken();

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

      await savePushToken();
    };
    // handleUnregistration catches its own errors, so its promise is safe to drop.
    const onSessionDestroyed = () => void handleUnregistration();

    Emitter.on("sessionDestroyed", onSessionDestroyed);

    return () => {
      Emitter.off("sessionDestroyed", onSessionDestroyed);
    };
  }, [posthog, savePushToken]);
};
