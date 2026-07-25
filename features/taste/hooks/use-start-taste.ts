import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { tasteJourneyAtom } from "@/atoms";
import {
  INITIAL_SHOWN,
  initialTasteJourneyState,
} from "@/features/taste/state";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useFetchTaste } from "@/features/taste/data/use-fetch-taste";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { lockedGenreIds } from "@/features/taste/locked-genres";

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
  // The pools say which genres a stored pick locked. Its own failure is shown
  // by the journey layout, so only the wait matters here.
  const { data: journey } = useFetchJourney();
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
    (journey !== undefined &&
      currentUser !== undefined &&
      (!hasStoredTaste || Boolean(storedTaste)));

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
    // The saved row holds one flat list, so the genres their picks locked are
    // taken back out to leave the ones they added themselves.
    const locked = lockedGenreIds(journey, profile.movieIds, profile.seriesIds);
    setState({
      ...profile,
      moviesShown: INITIAL_SHOWN,
      seriesShown: INITIAL_SHOWN,
      addedGenreIds: profile.genreIds.filter((id) => !locked.includes(id)),
    });
  }, [started, isReady, setState, storedTaste, journey]);

  return {
    isReady,
    // Only matters before the prefill lands: a later background refetch failing
    // must not throw away a journey the user is halfway through.
    hasFailedToLoadStoredTaste: !started && couldNotLoadStored,
    retryLoadingStoredTaste: tasteQuery.refetch,
  };
};
