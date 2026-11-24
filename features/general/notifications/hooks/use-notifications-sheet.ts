import { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import * as Notifications from "expo-notifications";
import {
  allowYTPlayingAtom,
  notificationsSheetRequestedAtom,
  notificationsSheetShownAtom,
} from "@/atoms";
import { ExposedBottomSheetModalRef } from "@/features/common/ui/bottom-sheet";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";
import { toNotificationsState } from "@/features/general/notifications/utils/permission";

/** Opens the sheet once per phone when asked for, and only while iOS hasn't asked about notifications yet. */
export const useNotificationsSheet = () => {
  const sheetRef = useRef<ExposedBottomSheetModalRef>(null);
  // Every way of closing the sheet counts as a skip, except "Turn on", which sends the iOS answer instead
  const isTurningOn = useRef(false);
  const sheetRequested = useAtomValue(notificationsSheetRequestedAtom);
  const [sheetShown, setSheetShown] = useAtom(notificationsSheetShownAtom);
  const setAllowYTPlaying = useSetAtom(allowYTPlayingAtom);
  const { notifications } = useAnalytics();

  useEffect(() => {
    if (!sheetRequested || sheetShown) return;

    const openIfNotAsked = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setSheetShown(true);
      if (status === Notifications.PermissionStatus.UNDETERMINED) {
        setAllowYTPlaying(false);
        sheetRef.current?.present();
        notifications.trackSheetShown();
      }
    };

    openIfNotAsked().catch((error: unknown) => {
      console.error("Could not read the notification permission:", error);
    });
  }, [
    sheetRequested,
    sheetShown,
    setSheetShown,
    setAllowYTPlaying,
    notifications,
  ]);

  const close = () => sheetRef.current?.dismiss();

  const onDismiss = () => {
    setAllowYTPlaying(true);
    if (!isTurningOn.current) {
      notifications.trackSheetSkipped();
    }
  };

  const turnOn = async () => {
    isTurningOn.current = true;
    close();
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      notifications.trackSheetAnswered({
        after: toNotificationsState(
          status === Notifications.PermissionStatus.GRANTED,
        ),
      });
    } catch (error) {
      console.error("Could not ask for the notification permission:", error);
    }
  };

  return { sheetRef, close, onDismiss, turnOn };
};
