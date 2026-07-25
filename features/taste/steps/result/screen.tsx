import { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { ErrorState } from "@/features/general/error-state";
import { Personality } from "@/features/taste/data/dto/taste.dto";
import { useSaveTaste } from "@/features/taste/data/use-save-taste";
import { SavingProgress } from "@/features/taste/steps/result/saving-progress";
import { tasteJourneyAtom } from "@/atoms";
import { Revealed } from "@/features/taste/steps/result/revealed";
import { SafeAreaView } from "react-native-safe-area-context";

// The loading screen stays up at least this long, even when the save returns
// faster, so the reveal never flashes in.
const MIN_LOADING_MS = 3000;

export const Screen = () => {
  const state = useAtomValue(tasteJourneyAtom);
  const { trigger, error } = useSaveTaste();
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [personality, setPersonality] = useState<Personality>();

  const saveTaste = useCallback(async () => {
    const { moviesShown, seriesShown, addedGenreIds, ...body } = state;
    return trigger(body);
  }, [trigger, state]);

  // The hook already exposes the failure through `error`; catching here only
  // stops it becoming an unhandled rejection that PostHog reports as a crash.
  const savePersonality = useCallback(() => {
    saveTaste()
      .then((data) => {
        // The card is a big picture and it is the whole screen, so start
        // pulling it while the loading bar is still up.
        void Image.prefetch(data.personality.image);
        setPersonality(data.personality);
      })
      .catch(() => {});
  }, [saveTaste]);

  useEffect(() => {
    savePersonality();

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
          tryAgain={savePersonality}
          error={
            "We couldn't save your taste. Check your connection and try again."
          }
        />
      ) : !personality || !minLoadingDone ? (
        <SavingProgress />
      ) : (
        <Revealed personality={personality} />
      )}
    </SafeAreaView>
  );
};
