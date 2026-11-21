import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { tasteAtom } from "@/atoms";
import { TitlePick } from "@/features/taste/data/dto/taste.dto";
import { pickKey } from "@/features/taste/state";

export const usePicks = () => {
  const [state, setState] = useAtom(tasteAtom);
  const pickedKeys = useMemo(
    () => new Set(state.picks.map(pickKey)),
    [state.picks],
  );

  const isPicked = useCallback(
    (title: TitlePick) => pickedKeys.has(pickKey(title)),
    [pickedKeys],
  );

  const togglePick = useCallback(
    ({ tmdbId, mediaType }: TitlePick) =>
      setState((draft) => {
        const key = pickKey({ tmdbId, mediaType });
        const index = draft.picks.findIndex((pick) => pickKey(pick) === key);
        if (index === -1) draft.picks.push({ tmdbId, mediaType });
        else draft.picks.splice(index, 1);
      }),
    [setState],
  );

  return { picks: state.picks, isPicked, togglePick };
};
