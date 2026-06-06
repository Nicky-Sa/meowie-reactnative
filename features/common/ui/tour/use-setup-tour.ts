import { useTourGuideController } from "rn-tourguide";
import { useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { homeTourSeenAtom } from "@/atoms";

export const useSetupTour = () => {
  const [homeTourSeen, setHomeTourSeen] = useAtom(homeTourSeenAtom);

  const { canStart, start, eventEmitter } = useTourGuideController();

  useEffect(() => {
    if (canStart && !homeTourSeen) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canStart]); // adding start will cause an infinite loop

  const handleOnStop = useCallback(() => {
    setHomeTourSeen(true);
  }, [setHomeTourSeen]);

  useEffect(() => {
    if (!eventEmitter) return;

    eventEmitter.on("stop", handleOnStop);
    return () => {
      eventEmitter.off("stop", handleOnStop);
    };
  }, [eventEmitter, handleOnStop]);
};
