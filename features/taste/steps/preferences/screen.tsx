import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Updater } from "use-immer";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { Slider } from "@/features/common/ui/slider";
import { Segment } from "@/features/common/ui/segment";
import { StepBody } from "@/features/taste/elements/step-body";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { tasteOnboardingAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteOnboardingAtom);

  const setAvoid: Updater<string[]> = (updater) => {
    setState((draft) => {
      if (typeof updater === "function") updater(draft.avoid);
      else draft.avoid = updater;
    });
  };

  const setExplore: Updater<string[]> = (updater) => {
    if (typeof updater === "function") return; // Slider only ever passes values
    setState((draft) => {
      draft.exploreLevel = Number(updater[0]);
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
        Optional. Tap what you&apos;d rather not see.
      </Text>

      {journey ? (
        <>
          <View className={"flex flex-row flex-wrap justify-center gap-2"}>
            {journey.avoidChips.map((label) => (
              <Segment
                key={label}
                item={{ id: label, label }}
                currentValues={state.avoid}
                setCurrentValues={setAvoid}
                multiple
              />
            ))}
          </View>

          <View className={"mt-4 flex flex-col items-center gap-4"}>
            <Text className={"title-t3 text-center text-neutral-10-default"}>
              How Adventurous?
            </Text>
            <Text className={"title-t1 text-neutral-10-default"}>
              {exploreLevels[state.exploreLevel]}
            </Text>
            <Slider
              currentValues={[String(state.exploreLevel)]}
              setCurrentValues={setExplore}
              min={0}
              max={exploreLevels.length - 1}
              step={1}
              labels={[
                exploreLevels[0],
                exploreLevels[exploreLevels.length - 1],
              ]}
              debounceDelay={0}
            />
          </View>
        </>
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
