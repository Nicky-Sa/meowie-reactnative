import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useSpotlightTour } from "react-native-spotlight-tour";
import { homeTourSeenAtom } from "@/atoms";

// To make sure the tour is the last item to be rendered
const TOUR_START_DELAY_MS = 0;

export const useSetupTour = () => {
  const homeTourSeen = useAtomValue(homeTourSeenAtom);
  const { start } = useSpotlightTour();

  useEffect(() => {
    if (homeTourSeen) return;

    const timer = setTimeout(start, TOUR_START_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeTourSeen]);
};
