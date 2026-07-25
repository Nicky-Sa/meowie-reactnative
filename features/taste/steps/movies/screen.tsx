import { Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";
import { StepBody } from "@/features/taste/elements/step-body";
import { PosterGrid } from "@/features/taste/elements/poster-grid";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { SHOW_MORE_COUNT } from "@/features/taste/state";
import { tasteJourneyAtom } from "@/atoms";
import { useStartTaste } from "@/features/taste/hooks/use-start-taste";

const MIN_SELECTIONS = 4;

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);
  const count = state.movieIds.length;
  const canContinue = count >= MIN_SELECTIONS;

  // Movies is the flow's entry step, so it sets up state on mount: blank for
  // a first run, the stored profile when the user comes back to edit.
  const { isReady, hasFailedToLoadStoredTaste, retryLoadingStoredTaste } =
    useStartTaste();

  const toggle = (tmdbId: number) =>
    setState((draft) => {
      const existingIndex = draft.movieIds.indexOf(tmdbId);
      if (existingIndex >= 0) draft.movieIds.splice(existingIndex, 1);
      else draft.movieIds.push(tmdbId);
    });

  const showMore = () =>
    setState((draft) => {
      draft.moviesShown += SHOW_MORE_COUNT;
    });

  if (hasFailedToLoadStoredTaste) {
    return (
      <ErrorState
        tryAgain={retryLoadingStoredTaste}
        error={
          "We couldn't load your saved taste. Check your connection and try again."
        }
      />
    );
  }

  return (
    <StepBody
      footer={
        <>
          <Text className={"body-b1 text-center text-neutral-6-default"}>
            {canContinue
              ? `${count} selected`
              : `Pick at least 4 · ${count} selected`}
          </Text>
          <Button
            variant={"white"}
            size={"lg"}
            disabled={!canContinue}
            onPress={() => router.push("/taste/series")}
          >
            Next
          </Button>
        </>
      }
    >
      {journey && isReady ? (
        <PosterGrid
          items={journey.movies}
          shown={state.moviesShown}
          selected={state.movieIds}
          onToggle={toggle}
          onShowMore={showMore}
        />
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
