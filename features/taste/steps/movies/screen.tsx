import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { StepBody } from "@/features/taste/elements/step-body";
import { RatingStep } from "@/features/taste/elements/rating-step";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { TitleAnswer } from "@/features/taste/data/dto/taste.dto";
import { countOpinions } from "@/features/taste/state";
import { tasteJourneyAtom } from "@/atoms";
import { useStartTaste } from "@/features/taste/hooks/use-start-taste";

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);
  const rated = countOpinions(state.movieRatings);
  // The minimum comes with the journey, so nothing can continue before it lands.
  const canContinue = journey !== undefined && rated >= journey.minMoviesToRate;

  const ratedLabel = () => {
    if (!journey) return "";
    if (canContinue) return `${rated} rated`;
    return `${rated}/${journey.minMoviesToRate} rated`;
  };

  // Movies is the flow's entry step, so it clears the state on mount.
  const { isReady } = useStartTaste();

  const rate = (tmdbId: number, answer: TitleAnswer) =>
    setState((draft) => {
      draft.movieRatings[tmdbId] = answer;
    });

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
        {ratedLabel()}
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
