import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { tasteJourneyAtom } from "@/atoms";
import { initialTasteJourneyState } from "@/features/taste/state";

/**
 * Wipes the journey state when the flow opens. There is no editing of a saved
 * taste — the only way back in is "Start over" — so every run begins blank.
 * The entry step must hold its deck until `isReady`, or the run before would
 * show its answers for a frame.
 */
export const useStartTaste = () => {
  const setState = useSetAtom(tasteJourneyAtom);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setState(initialTasteJourneyState());
    setIsReady(true);
  }, [setState]);

  return { isReady };
};
