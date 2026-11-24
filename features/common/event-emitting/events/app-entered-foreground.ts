import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useSavePushToken } from "@/features/general/notifications/data/use-save-push-token";

/** Saves the phone's row each time the app comes back from the background. */
export const useAppEnteredForeground = () => {
  const { savePushToken } = useSavePushToken();

  useEffect(() => {
    let appState = AppState.currentState;

    const onAppStateChange = (nextAppState: AppStateStatus) => {
      // Only "background" counts, because popups like iOS's permission question also pass through "inactive"
      // savePushToken logs its own errors, so its promise is safe to drop
      if (appState === "background" && nextAppState === "active") {
        void savePushToken();
      }
      appState = nextAppState;
    };

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [savePushToken]);
};
