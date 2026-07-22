import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { tasteOnboardingAtom } from "@/atoms";
import {
  INITIAL_SHOWN,
  initialTasteOnboardingState,
  TasteOnboardingState,
} from "@/features/taste/state";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { useFetchTaste } from "@/features/taste/data/use-fetch-taste";
import { JourneyResDto, Title } from "@/features/taste/data/dto/journey.dto";
import { TasteResDto } from "@/features/taste/data/dto/taste.dto";

// Enough of the pool to show every stored pick without pressing "Show more".
const shownFor = (pool: Title[], selectedIds: number[]): number => {
  const lastSelectedIndex = pool.reduce(
    (last, title, index) => (selectedIds.includes(title.tmdbId) ? index : last),
    -1,
  );
  return Math.max(INITIAL_SHOWN, lastSelectedIndex + 1);
};

const stateFromStored = (
  stored: TasteResDto,
  journey: JourneyResDto,
): TasteOnboardingState => {
  const state = initialTasteOnboardingState();
  state.moviesSelected = [...stored.movieIds];
  state.seriesSelected = [...stored.seriesIds];
  state.seriesSkipped = stored.seriesSkipped;
  state.genresConfirmed = [...stored.genreIds];
  // Stored genres are the user's confirmed picks — don't re-run auto-select.
  state.genresTouched = true;
  state.taste = {
    era: stored.era,
    reality: stored.reality,
    tasteAuthority: stored.tasteAuthority,
    commitment: stored.commitment,
  };
  state.avoid = [...stored.avoid];
  state.exploreLevel = stored.exploreLevel;
  state.moviesShown = shownFor(journey.movies, stored.movieIds);
  state.seriesShown = shownFor(journey.series, stored.seriesIds);
  return state;
};

/**
 * Fills the wizard state on the entry step: blank for a first run, the stored
 * profile when the user comes back to edit. The entry screen should hold
 * rendering until `isReady` so a prefill can't overwrite fresh edits.
 *
 * A failed taste fetch does NOT fall back to the blank flow — silently
 * treating "couldn't load" the same as "nothing stored" would let the user
 * finish the wizard from scratch and overwrite a perfectly good saved
 * profile. Instead `hasFailedToLoadStoredTaste` tells the entry screen to
 * show an error with a way to retry.
 */
export const useStartTaste = () => {
  const setState = useSetAtom(tasteOnboardingAtom);
  const { data: currentUser } = useCurrentUser();
  const { data: journey } = useFetchJourney();
  const hasStoredTaste = Boolean(currentUser?.user?.hasFilledInTaste);
  const tasteQuery = useFetchTaste({ enabled: hasStoredTaste });
  const storedTaste = tasteQuery.data ?? null;
  const [started, setStarted] = useState(false);

  const hasFailedToLoadStoredTaste = hasStoredTaste && tasteQuery.isError;
  const isReady =
    started ||
    (currentUser !== undefined &&
      (!hasStoredTaste || tasteQuery.isSuccess) &&
      (!storedTaste || !!journey));

  useEffect(() => {
    if (started || !isReady) return;
    setStarted(true);
    setState(
      storedTaste && journey
        ? stateFromStored(storedTaste, journey)
        : initialTasteOnboardingState(),
    );
  }, [started, isReady, setState, storedTaste, journey]);

  return {
    isReady,
    hasFailedToLoadStoredTaste,
    retryLoadingStoredTaste: tasteQuery.refetch,
  };
};
