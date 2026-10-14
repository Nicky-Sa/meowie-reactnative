import { useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "@/features/general/error-state";
import { useSaveTaste } from "@/features/taste/data/use-save-taste";
import { SavingProgress } from "@/features/taste/steps/result/saving-progress";
import { tasteJourneyAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const state = useAtomValue(tasteJourneyAtom);
  const { trigger, error } = useSaveTaste();

  const saveTaste = useCallback(() => {
    void trigger(state)
      .then(() => router.replace("/home"))
      .catch(() => {});
  }, [router, state, trigger]);

  useEffect(() => {
    saveTaste();
  }, [saveTaste]);

  return (
    <SafeAreaView
      className={"flex flex-1 flex-col px-4"}
      edges={["top", "bottom"]}
    >
      {error ? (
        <ErrorState
          tryAgain={saveTaste}
          error={
            "We couldn't save your taste. Check your connection and try again."
          }
        />
      ) : (
        <SavingProgress />
      )}
    </SafeAreaView>
  );
};
