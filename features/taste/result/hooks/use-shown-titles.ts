import { useMemo } from "react";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { TitlePick } from "@/features/taste/data/dto/taste.dto";
import { pickKey } from "@/features/taste/state";

const SHOWN_COUNT = 3;

/** Three of the picked titles, in random order, with the posters the grid loaded for them. */
export const useShownTitles = (picks: TitlePick[]) => {
  const { data: journey } = useFetchJourney();

  return useMemo(() => {
    const pickedKeys = new Set(picks.map(pickKey));
    return (journey?.titles ?? [])
      .filter((title) => pickedKeys.has(pickKey(title)))
      .map((title) => ({ title, order: Math.random() }))
      .sort((first, second) => first.order - second.order)
      .slice(0, SHOWN_COUNT)
      .map(({ title }) => title);
  }, [journey, picks]);
};
