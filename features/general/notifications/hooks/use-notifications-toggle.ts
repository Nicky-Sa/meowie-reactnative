import { useEffect, useRef, useState } from "react";
import { Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { useAppState } from "@/hooks/use-app-state";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";
import { NOTIFICATION_SETTINGS_URL } from "@/lib/consts";
import { toNotificationsState } from "@/features/general/notifications/utils/permission";

/** Shows whether iOS allows Meowie's notifications, and changes it through the iOS popup or the iPhone Settings app. */
export const useNotificationsToggle = () => {
  const appState = useAppState();
  const [isOn, setIsOn] = useState(false);
  // The permission when the toggle sent the user to the iPhone Settings app, or null when they aren't there
  const permissionBeforeSettings = useRef<boolean | null>(null);
  const { notifications } = useAnalytics();

  // Reads the permission on every return to the app, because the user can change it in the iPhone Settings app
  useEffect(() => {
    if (appState !== "active") return;

    const readPermission = async () => {
      const { granted } = await Notifications.getPermissionsAsync();
      setIsOn(granted);

      const before = permissionBeforeSettings.current;
      if (before !== null) {
        permissionBeforeSettings.current = null;
        notifications.trackToggled({
          before: toNotificationsState(before),
          after: toNotificationsState(granted),
        });
      }
    };

    readPermission().catch((error: unknown) => {
      console.error("Could not read the notification permission:", error);
    });
  }, [appState, notifications]);

  const toggle = async () => {
    try {
      const { granted, canAskAgain } =
        await Notifications.getPermissionsAsync();

      // iOS shows its popup only until the user answers it once
      if (!granted && canAskAgain) {
        const answer = await Notifications.requestPermissionsAsync();
        setIsOn(answer.granted);
        notifications.trackToggled({
          before: toNotificationsState(granted),
          after: toNotificationsState(answer.granted),
        });
        return;
      }

      permissionBeforeSettings.current = granted;
      await Linking.openURL(NOTIFICATION_SETTINGS_URL);
    } catch (error) {
      console.error("Could not change the notification permission:", error);
    }
  };

  return { isOn, toggle };
};
