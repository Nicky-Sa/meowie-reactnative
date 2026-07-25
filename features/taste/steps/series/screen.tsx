import { Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { StepBody } from "@/features/taste/elements/step-body";
import { PosterGrid } from "@/features/taste/elements/poster-grid";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { SHOW_MORE_COUNT } from "@/features/taste/state";
import { tasteJourneyAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);
  const count = state.seriesIds.length;

  const toggle = (tmdbId: number) =>
    setState((draft) => {
      const existingIndex = draft.seriesIds.indexOf(tmdbId);
      if (existingIndex >= 0) draft.seriesIds.splice(existingIndex, 1);
      else draft.seriesIds.push(tmdbId);
      draft.seriesSkipped = false;
    });

  const showMore = () =>
    setState((draft) => {
      draft.seriesShown += SHOW_MORE_COUNT;
    });

  const skip = () => {
    setState((draft) => {
      draft.seriesIds = [];
      draft.seriesSkipped = true;
    });
    router.push("/taste/genres");
  };

  return (
    <StepBody
      footer={
        <>
          <Text className={"body-b1 text-center text-neutral-6-default"}>
            {`${count} selected`}
          </Text>
          <Button
            variant={"white"}
            size={"lg"}
            onPress={() => router.push("/taste/genres")}
          >
            Continue
          </Button>
          <Button variant={"ghost"} size={"md"} onPress={skip}>
            Skip, I mostly watch movies
          </Button>
        </>
      }
    >
      {journey ? (
        <PosterGrid
          items={journey.series}
          shown={state.seriesShown}
          selected={state.seriesIds}
          onToggle={toggle}
          onShowMore={showMore}
        />
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
