import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";
import { StepBody } from "@/features/taste/elements/step-body";
import { RatingStep } from "@/features/taste/elements/rating-step";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { TitleAnswer } from "@/features/taste/data/dto/taste.dto";
import { countOpinions, MIN_RATED_MOVIES } from "@/features/taste/state";
import { tasteJourneyAtom } from "@/atoms";
import { useStartTaste } from "@/features/taste/hooks/use-start-taste";

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);
  const rated = countOpinions(state.movieRatings);
  const canContinue = rated >= MIN_RATED_MOVIES;

  // Movies is the flow's entry step, so it sets up state on mount: blank for
  // a first run, the stored profile when the user comes back to edit.
  const { isReady, hasFailedToLoadStoredTaste, retryLoadingStoredTaste } =
    useStartTaste();

  const rate = (tmdbId: number, answer: TitleAnswer) =>
    setState((draft) => {
      draft.movieRatings[tmdbId] = answer;
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
      scrollable={false}
      footer={
        <Button
          variant={"white"}
          size={"lg"}
          disabled={!canContinue}
          onPress={() => router.push("/taste/series")}
        >
          Next
        </Button>
      }
    >
      <Text className={"body-b1 text-center text-neutral-6-default"}>
        {canContinue ? `${rated} rated` : `${rated}/${MIN_RATED_MOVIES} rated`}
      </Text>

      {journey && isReady ? (
        <RatingStep
          items={journey.movies}
          ratings={state.movieRatings}
          onRate={rate}
        />
      ) : (
        <View className={"flex-1 justify-center"}>
          <Loading />
        </View>
      )}
    </StepBody>
  );
};
