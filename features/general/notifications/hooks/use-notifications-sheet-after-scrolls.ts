import { useEffect } from "react";
import { useRequestNotificationsSheet } from "@/features/general/notifications/hooks/use-request-notifications-sheet";

// The sixth card, after five scrolls
const SHEET_FEED_CARD_INDEX = 5;

export const useNotificationsSheetAfterScrolls = (currentIndex: number) => {
  const requestNotificationsSheet = useRequestNotificationsSheet();

  useEffect(() => {
    if (currentIndex >= SHEET_FEED_CARD_INDEX) requestNotificationsSheet();
  }, [currentIndex, requestNotificationsSheet]);
};
