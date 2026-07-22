import { Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { StepBody } from "@/features/taste/elements/step-body";
import { PosterGrid } from "@/features/taste/elements/poster-grid";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { PAGE_SIZE } from "@/features/taste/state";
import { tasteOnboardingAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteOnboardingAtom);
  const count = state.seriesSelected.length;

  const toggle = (tmdbId: number) =>
    setState((draft) => {
      const existingIndex = draft.seriesSelected.indexOf(tmdbId);
      if (existingIndex >= 0) draft.seriesSelected.splice(existingIndex, 1);
      else draft.seriesSelected.push(tmdbId);
      draft.seriesSkipped = false;
    });

  const showMore = () =>
    setState((draft) => {
      draft.seriesShown += PAGE_SIZE;
    });

  const skip = () => {
    setState((draft) => {
      draft.seriesSelected = [];
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
          selected={state.seriesSelected}
          onToggle={toggle}
          onShowMore={showMore}
        />
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
