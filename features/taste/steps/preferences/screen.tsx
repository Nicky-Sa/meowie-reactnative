import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Updater } from "use-immer";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { Segment } from "@/features/common/ui/segment";
import { StepBody } from "@/features/taste/elements/step-body";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { tasteJourneyAtom } from "@/atoms";

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

  return (
    <StepBody
      footer={
        <Button
          variant={"white"}
          size={"lg"}
          onPress={() => router.push("/taste/result")}
        >
          Save my taste
        </Button>
      }
    >
      {journey ? (
        <View className={"mt-10 flex flex-col gap-8"}>
          <View className={"flex flex-col gap-4"}>
            <Text className={"title-t3 text-center text-neutral-10-default"}>
              Anything to avoid?
            </Text>

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
          </View>
        </View>
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
