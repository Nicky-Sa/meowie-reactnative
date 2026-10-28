import { useCallback } from "react";
import { useAtom } from "jotai";
import { tasteAtom } from "@/atoms";
import { useSubmitTaste } from "@/features/taste/data/use-submit-taste";
import { initialTasteState } from "@/features/taste/state";

export const useAfterLogin = () => {
  const [taste, setTaste] = useAtom(tasteAtom);
  const { trigger: submitTaste } = useSubmitTaste();

  const afterLogin = useCallback(async () => {
    if (!taste.completed) return;

    await submitTaste(taste.answers);
    setTaste(initialTasteState());
  }, [taste, submitTaste, setTaste]);

  return { afterLogin };
};
