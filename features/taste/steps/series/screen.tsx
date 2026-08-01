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

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);
  const rated = countOpinions(state.seriesRatings);

  const rate = (tmdbId: number, answer: TitleAnswer) =>
    setState((draft) => {
      draft.seriesRatings[tmdbId] = answer;
    });

  return (
    <StepBody
      scrollable={false}
      footer={
        <Button
          variant={"white"}
          size={"lg"}
          onPress={() =>
            router.push({
              pathname: "/taste/questions/[order]",
              params: { order: "1" },
            })
          }
        >
          Next
        </Button>
      }
    >
      <Text className={"body-b1 text-center text-neutral-6-default"}>
        {`${rated} rated`}
      </Text>

      {journey ? (
        <RatingStep
          items={journey.series}
          ratings={state.seriesRatings}
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
