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
import { tasteJourneyAtom } from "@/atoms";
import { tailwind } from "@/lib/tailwind";

const COLUMNS = 2;
const GAP = Number(tailwind.theme.gap["2"]);
const HORIZONTAL_PADDING = Number(tailwind.theme.padding["4"]) * 2;

export const Screen = () => {
  const router = useRouter();
  const { genreEmoji, genreName } = useGenres();
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);
  const { itemWidth } = useGridItemWidth({
    numColumns: COLUMNS,
    gap: GAP,
    horizontalPadding: HORIZONTAL_PADDING,
  });

  // Every genre carried by the titles the user picked. All count the same
  // here — the feed's scoring is what weighs common against rare.
  const lockedGenres = useMemo(() => {
    const picked = [
      ...(journey?.movies ?? []),
      ...(journey?.series ?? []),
    ].filter(
      (title) =>
        state.movieIds.includes(title.tmdbId) ||
        state.seriesIds.includes(title.tmdbId),
    );
    return [...new Set(picked.flatMap((title) => title.genreIds))];
  }, [journey, state.movieIds, state.seriesIds]);

  // The picked titles decide these, so they go back in even if the user
  // changes their titles after passing through this step.
  useEffect(() => {
    setState((draft) => {
      for (const genre of lockedGenres) {
        if (!draft.genreIds.includes(genre)) {
          draft.genreIds.push(genre);
        }
      }
    });
  }, [lockedGenres, setState]);

  const setGenres: Updater<number[]> = (updater) => {
    setState((draft) => {
      if (typeof updater === "function") updater(draft.genreIds);
      else draft.genreIds = updater;
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
            {`${state.genreIds.length} genres selected`}
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
                currentValues={state.genreIds}
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
