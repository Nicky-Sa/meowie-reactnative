import { useCallback } from "react";
import { useAtom } from "jotai";
import { tasteAtom } from "@/atoms";
import { useSaveTaste } from "@/features/taste/data/use-save-taste";
import { initialTasteState } from "@/features/taste/state";

export const useAfterLogin = () => {
  const [taste, setTaste] = useAtom(tasteAtom);
  const { trigger: saveTaste } = useSaveTaste();

  const afterLogin = useCallback(async () => {
    if (!taste.completed) return;

    await saveTaste(taste.answers);
    setTaste(initialTasteState());
  }, [taste, saveTaste, setTaste]);

  return { afterLogin };
};
