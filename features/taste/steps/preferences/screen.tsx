import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Updater } from "use-immer";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { Slider } from "@/features/common/ui/slider";
import { Segment } from "@/features/common/ui/segment";
import { StepBody } from "@/features/taste/elements/step-body";
import { ExploreLevelLottie } from "@/features/taste/elements/explore-level-lottie";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { tasteJourneyAtom } from "@/atoms";
import { Divider } from "@/features/common/ui/divider";

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);

  const setAvoid: Updater<string[]> = (updater) => {
    setState((draft) => {
      if (typeof updater === "function") updater(draft.avoid);
      else draft.avoid = updater;
    });
  };

  const setExplore: Updater<string[]> = (updater) => {
    setState((draft) => {
      const current = [String(draft.exploreLevel)];
      const next = typeof updater === "function" ? updater(current) : updater;
      draft.exploreLevel = Number((next ?? current)[0]);
    });
  };

  const exploreLevels = journey?.exploreLevels ?? [];

  return (
    <StepBody
      footer={
        <Button
          variant={"white"}
          size={"lg"}
          onPress={() => router.push("/taste/result")}
        >
          See my type
        </Button>
      }
    >
      <Text className={"body-b1 text-center text-neutral-8-default"}>
        Tap what you&apos;d rather not see. (optional)
      </Text>

      {journey ? (
        <View className={"flex flex-col gap-8"}>
          <View className={"flex flex-row flex-wrap justify-center gap-2"}>
            {journey.avoidChips.map((chip) => (
              <Segment
                key={chip.id}
                item={chip}
                currentValues={state.avoid}
                setCurrentValues={setAvoid}
                multiple
              />
            ))}
          </View>

          <Divider />

          <View className={"flex flex-col items-center gap-4"}>
            <Text className={"title-t3 text-center text-neutral-10-default"}>
              How adventurous?
            </Text>
            <ExploreLevelLottie level={state.exploreLevel} />
            <Text className={"title-t2 text-neutral-10-default"}>
              {exploreLevels[state.exploreLevel]}
            </Text>
            <Slider
              currentValues={[String(state.exploreLevel)]}
              setCurrentValues={setExplore}
              min={0}
              max={exploreLevels.length - 1}
              step={1}
              labels={[]}
              debounceDelay={0}
              showStepDots
            />
          </View>
        </View>
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
