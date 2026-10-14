import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "@/features/general/error-state";
import { useSaveTaste } from "@/features/taste/data/use-save-taste";
import { SavingProgress } from "@/features/taste/steps/result/saving-progress";
import { tasteAtom } from "@/atoms";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { initialTasteState } from "@/features/taste/state";

export const Screen = () => {
  const router = useRouter();
  const state = useAtomValue(tasteAtom);
  const setTaste = useSetAtom(tasteAtom);
  const [tasteToSave] = useState(state.answers);
  const {
    data,
    isPending: isCurrentUserPending,
    error: currentUserError,
    refetch: refetchCurrentUSer,
  } = useCurrentUser();
  const userId = data?.user?.id ?? null;
  const { trigger, error: saveTasteError } = useSaveTaste();

  const saveTaste = useCallback(async () => {
    if (userId === null) {
      setTaste((draft) => {
        draft.completed = true;
      });
      router.replace({
        pathname: "/auth",
        params: { returnTo: "/home" },
      });
    } else {
      try {
        await trigger(tasteToSave);
      } catch {
        return;
      }
      setTaste(initialTasteState());
      router.replace("/home");
    }
  }, [userId, setTaste, tasteToSave, trigger, router]);

  useEffect(() => {
    if (!isCurrentUserPending && !currentUserError) void saveTaste();
  }, [isCurrentUserPending, currentUserError, saveTaste]);

  return (
    <SafeAreaView
      className={"flex flex-1 flex-col px-4"}
      edges={["top", "bottom"]}
    >
      {saveTasteError || currentUserError ? (
        <ErrorState
          tryAgain={currentUserError ? refetchCurrentUSer : saveTaste}
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
