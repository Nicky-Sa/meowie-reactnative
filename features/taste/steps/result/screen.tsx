import { useCallback, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { ErrorState } from "@/features/general/error-state";
import { TasteOnboardingState } from "@/features/taste/state";
import {
  ResolvedPersonality,
  SaveTasteReqDto,
} from "@/features/taste/data/dto/taste.dto";
import { useSaveTaste } from "@/features/taste/data/use-save-taste";
import { Loading } from "@/features/taste/steps/result/loading";
import { tasteOnboardingAtom } from "@/atoms";
import { Revealed } from "@/features/taste/steps/result/revealed";
import { SafeAreaView } from "react-native-safe-area-context";

// The recommendation engine consumes only these profile fields — never the
// personality result, which is presentation-only.
const buildSaveBody = (state: TasteOnboardingState): SaveTasteReqDto => ({
  movieIds: state.moviesSelected,
  seriesIds: state.seriesSelected,
  seriesSkipped: state.seriesSkipped,
  genreIds: state.genresConfirmed,
  // The wizard can't reach the reveal without answering all four questions;
  // 'both' is the neutral defensive fallback if it somehow does.
  era: state.taste.era!,
  reality: state.taste.reality!,
  tasteAuthority: state.taste.tasteAuthority!,
  commitment: state.taste.commitment!,
  avoid: state.avoid,
  exploreLevel: state.exploreLevel,
});

// The loading screen stays up at least this long, even when the save returns
// faster, so the reveal never flashes in.
const MIN_LOADING_MS = 3000;

export const Screen = () => {
  const state = useAtomValue(tasteOnboardingAtom);
  const { trigger, error } = useSaveTaste();
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [personality, setPersonality] = useState<ResolvedPersonality>();

  const saveTaste = useCallback(async () => {
    return trigger(buildSaveBody(state));
  }, [trigger, state]);

  useEffect(() => {
    saveTaste().then((data) => setPersonality(data.personality));

    const timer = setTimeout(() => setMinLoadingDone(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView
      className={"flex flex-1 flex-col px-4"}
      edges={["top", "bottom"]}
    >
      {error ? (
        <ErrorState
          tryAgain={saveTaste}
          error={
            "We couldn't save your taste. Check your connection and try again."
          }
        />
      ) : !personality || !minLoadingDone ? (
        <Loading />
      ) : (
        <Revealed personality={personality} />
      )}
    </SafeAreaView>
  );
};
