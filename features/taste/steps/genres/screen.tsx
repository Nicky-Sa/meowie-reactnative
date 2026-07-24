import { useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Updater } from "use-immer";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { Segment, SegmentItem } from "@/features/common/ui/segment";
import { useGridItemWidth } from "@/features/common/hooks/list/use-grid-item-width";
import { StepBody } from "@/features/taste/elements/step-body";
import { useGenres } from "@/features/general/data/constants/use-genres";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { tasteOnboardingAtom } from "@/atoms";
import { genresFromPicks } from "@/features/taste/logic/genres";
import { tailwind } from "@/lib/tailwind";

const COLUMNS = 2;
const GAP = Number(tailwind.theme.gap["2"]);
const HORIZONTAL_PADDING = Number(tailwind.theme.padding["4"]) * 2;

export const Screen = () => {
  const router = useRouter();
  const { genreEmoji, genreName } = useGenres();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteOnboardingAtom);
  const { itemWidth } = useGridItemWidth({
    numColumns: COLUMNS,
    gap: GAP,
    horizontalPadding: HORIZONTAL_PADDING,
  });

  const lockedGenres = useMemo(
    () =>
      journey
        ? genresFromPicks(journey, state.moviesSelected, state.seriesSelected)
        : [],
    [journey, state.moviesSelected, state.seriesSelected],
  );

  // The picked titles decide these, so they go back in even if the user
  // changes their titles after passing through this step.
  useEffect(() => {
    setState((draft) => {
      for (const genre of lockedGenres) {
        if (!draft.genresConfirmed.includes(genre)) {
          draft.genresConfirmed.push(genre);
        }
      }
    });
  }, [lockedGenres, setState]);

  const setGenres: Updater<number[]> = (updater) => {
    setState((draft) => {
      if (typeof updater === "function") updater(draft.genresConfirmed);
      else draft.genresConfirmed = updater;
    });
  };

  const items: SegmentItem<number>[] = (journey?.genreIds ?? []).map(
    (genreId) => ({
      id: genreId,
      label: `${genreEmoji(genreId)} ${genreName(genreId)}`,
    }),
  );

  return (
    <StepBody
      footer={
        <>
          <Text className={"body-b1 text-center text-neutral-6-default"}>
            {`${state.genresConfirmed.length} genres selected`}
          </Text>
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
            Continue
          </Button>
        </>
      }
    >
      <Text className={"body-b1 text-center text-neutral-8-default"}>
        These come from the titles you picked. Add any others you like.
      </Text>
      {journey ? (
        <View className={"flex flex-row flex-wrap"} style={{ gap: GAP }}>
          {items.map((item) => (
            <View key={item.id} style={{ width: itemWidth }}>
              <Segment
                item={item}
                currentValues={state.genresConfirmed}
                setCurrentValues={setGenres}
                locked={lockedGenres.includes(item.id)}
                multiple
              />
            </View>
          ))}
        </View>
      ) : (
        <Loading />
      )}
    </StepBody>
  );
};
