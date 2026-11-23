import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  notificationsSheetRequestedAtom,
  notificationsSheetShownAtom,
} from "@/atoms";

export const useRequestNotificationsSheet = () => {
  const sheetShown = useAtomValue(notificationsSheetShownAtom);
  const setSheetRequested = useSetAtom(notificationsSheetRequestedAtom);

  return useCallback(() => {
    if (!sheetShown) setSheetRequested(true);
  }, [sheetShown, setSheetRequested]);
};
