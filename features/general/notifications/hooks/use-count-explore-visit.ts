import { useCallback } from "react";
import { useAtomCallback } from "jotai/utils";
import {
  exploreVisitCountAtom,
  notificationsSheetRequestedAtom,
  notificationsSheetShownAtom,
} from "@/atoms";

const SHEET_EXPLORE_VISIT = 2;

// Reads the atoms when it runs, because the tab bar keeps an old copy of this function
export const useCountExploreVisit = () =>
  useAtomCallback(
    useCallback((get, set) => {
      if (get(notificationsSheetShownAtom)) return;

      const nextVisitCount = get(exploreVisitCountAtom) + 1;
      set(exploreVisitCountAtom, nextVisitCount);
      if (nextVisitCount >= SHEET_EXPLORE_VISIT) {
        set(notificationsSheetRequestedAtom, true);
      }
    }, []),
  );
