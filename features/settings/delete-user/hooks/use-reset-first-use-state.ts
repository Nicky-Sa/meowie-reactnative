import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import {
  exploreVisitCountAtom,
  feedFirstScrollTrackedAtom,
  homeTourSeenAtom,
  notificationsSheetShownAtom,
  scrollHintSeenAtom,
} from "@/atoms";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";

/** Gives back a function that clears what the phone saved about a user's first use, like onboarding, the tour and the hints. */
export const useResetFirstUseState = () => {
  const setHomeTourSeen = useSetAtom(homeTourSeenAtom);
  const setScrollHintSeen = useSetAtom(scrollHintSeenAtom);
  const setFeedFirstScrollTracked = useSetAtom(feedFirstScrollTrackedAtom);
  const setNotificationsSheetShown = useSetAtom(notificationsSheetShownAtom);
  const setExploreVisitCount = useSetAtom(exploreVisitCountAtom);

  return useCallback(() => {
    setHomeTourSeen(RESET);
    setScrollHintSeen(RESET);
    setFeedFirstScrollTracked(RESET);
    setNotificationsSheetShown(RESET);
    setExploreVisitCount(RESET);
    appStorage.removeItem(APP_STORAGE_KEYS.ONBOARDED);
  }, [
    setHomeTourSeen,
    setScrollHintSeen,
    setFeedFirstScrollTracked,
    setNotificationsSheetShown,
    setExploreVisitCount,
  ]);
};
