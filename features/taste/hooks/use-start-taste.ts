import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { tasteJourneyAtom } from "@/atoms";
import {
  INITIAL_SHOWN,
  initialTasteJourneyState,
} from "@/features/taste/state";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useFetchTaste } from "@/features/taste/data/use-fetch-taste";

/**
 * Fills the journey state on the entry step: blank for a first run, the stored
 * profile when the user comes back to edit. The entry screen should hold
 * rendering until `isReady` so a prefill can't overwrite fresh edits.
 *
 * A failed taste load must never fall through to the blank flow — that would
 * let the user finish the journey and overwrite a good saved profile.
 */
export const useStartTaste = () => {
  const setState = useSetAtom(tasteJourneyAtom);
  const { data: currentUser } = useCurrentUser();
  const hasStoredTaste = Boolean(currentUser?.user?.hasFilledInTaste);
  const tasteQuery = useFetchTaste({ enabled: hasStoredTaste });
  const storedTaste = tasteQuery.data;
  const [started, setStarted] = useState(false);

  // A profile that should exist but came back empty counts as a failure for the
  // same reason: starting blank would overwrite it.
  const couldNotLoadStored =
    hasStoredTaste &&
    (tasteQuery.isError || (tasteQuery.isSuccess && !storedTaste));

  const isReady =
    started ||
    (currentUser !== undefined && (!hasStoredTaste || Boolean(storedTaste)));

  useEffect(() => {
    if (started || !isReady) return;
    setStarted(true);
    if (!storedTaste) {
      setState(initialTasteJourneyState());
      return;
    }
    // personality is response-only decoration — spreading it into the journey
    // state would send it back in the save body.
    const { personality, ...profile } = storedTaste;
    setState({
      ...profile,
      moviesShown: INITIAL_SHOWN,
      seriesShown: INITIAL_SHOWN,
    });
  }, [started, isReady, setState, storedTaste]);

  return {
    isReady,
    // Only matters before the prefill lands: a later background refetch failing
    // must not throw away a journey the user is halfway through.
    hasFailedToLoadStoredTaste: !started && couldNotLoadStored,
    retryLoadingStoredTaste: tasteQuery.refetch,
  };
};
