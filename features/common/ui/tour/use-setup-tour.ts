import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useSpotlightTour } from "react-native-spotlight-tour";
import { homeTourSeenAtom } from "@/atoms";
import { homeTourSteps } from "@/features/common/ui/tour/steps";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";

// To make sure the tour is the last item to be rendered
const TOUR_START_DELAY_MS = 0;

export const useSetupTour = () => {
  const homeTourSeen = useAtomValue(homeTourSeenAtom);
  const { start } = useSpotlightTour();
  const { tour } = useAnalytics();

  useEffect(() => {
    if (homeTourSeen) return;

    const timer = setTimeout(() => {
      tour.trackStarted({ totalSteps: homeTourSteps.length });
      start();
    }, TOUR_START_DELAY_MS);

    return () => clearTimeout(timer);
  }, [homeTourSeen, start, tour]);
};
