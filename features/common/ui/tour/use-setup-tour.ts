import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import { useSpotlightTour } from "react-native-spotlight-tour";
import { homeTourSeenAtom } from "@/atoms";
import { homeTourSteps } from "@/features/common/ui/tour/steps";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";

// To make sure the tour is the last item to be rendered
const TOUR_START_DELAY_MS = 0;

/**
 * Waits for `isReady`, so the step that points at the first card has a loaded card to point at.
 * Starts only while the screen is in focus, so a card that loads behind another tab doesn't open the tour there.
 */
export const useSetupTour = (isReady: boolean) => {
  const homeTourSeen = useAtomValue(homeTourSeenAtom);
  const { start } = useSpotlightTour();
  const { tour } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (!isReady || homeTourSeen) return;

      const timer = setTimeout(() => {
        tour.trackStarted({ totalSteps: homeTourSteps.length });
        start();
      }, TOUR_START_DELAY_MS);

      return () => clearTimeout(timer);
    }, [isReady, homeTourSeen, start, tour]),
  );
};
