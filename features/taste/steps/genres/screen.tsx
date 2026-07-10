import { useEffect, useMemo, useRef } from "react";
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
import { genreAutoselect } from "@/features/taste/logic/genres";
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
  const seeded = useRef(false);

  const autoSelected = useMemo(
    () =>
      journey
        ? genreAutoselect(
            journey,
            state.moviesSelected,
            state.seriesSelected,
          ).map((info) => info.label)
        : [],
    [journey, state.moviesSelected, state.seriesSelected],
  );

  // Seed genres from auto-select once the journey data is here, unless the
  // user has already edited them.
  useEffect(() => {
    if (!journey || seeded.current) return;
    seeded.current = true;
    if (!state.genresTouched) {
      setState((draft) => {
        draft.genresConfirmed = autoSelected;
      });
    }
  }, [journey, autoSelected, setState, state.genresTouched]);

  const setGenres: Updater<number[]> = (updater) => {
    setState((draft) => {
      if (typeof updater === "function") updater(draft.genresConfirmed);
      else draft.genresConfirmed = updater;
      draft.genresTouched = true;
    });
  };

  const items: SegmentItem<number>[] = (journey?.genreChips ?? []).map(
    (chip) => ({
      id: chip.id,
      label: `${genreEmoji(chip.id)} ${genreName(chip.id)}`,
      description: chip.example,
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
        We picked these from your titles, and you can tweak them.
      </Text>
      {journey ? (
        <View className={"flex flex-row flex-wrap"} style={{ gap: GAP }}>
          {items.map((item) => (
            <View key={item.id} style={{ width: itemWidth }}>
              <Segment
                item={item}
                currentValues={state.genresConfirmed}
                setCurrentValues={setGenres}
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
