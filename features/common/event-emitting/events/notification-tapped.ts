import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { usePathname, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { isAppPath } from "@/lib/utils/query";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";

/** Opens the screen a push notification names when the user taps it, also when the tap started the app. */
export const useNotificationTapped = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setLinkToOpen = useSetAtom(linkToOpenAtom);
  const { notifications } = useAnalytics();

  useEffect(() => {
    const onNotificationTapped = (
      response: Notifications.NotificationResponse,
    ) => {
      // Cleared, so the same tap doesn't open its screen again when this effect runs again
      Notifications.clearLastNotificationResponse();

      const url = response.notification.request.content.data?.url;
      const path = isAppPath(url) ? url : null;
      notifications.trackPushNotificationOpened({ path });

      if (!path) return;
      if (pathname === "/") {
        // The init screen replaces itself with Home, so it opens the link after that.
        setLinkToOpen(path);
      } else {
        router.push(path);
      }
    };

    // A tap that started the app comes before this listener exists, so it's read here
    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) onNotificationTapped(lastResponse);

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        onNotificationTapped,
      );

    return () => {
      subscription.remove();
    };
  }, [router, pathname, setLinkToOpen, notifications]);
};
