import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "@/features/general/error-state";
import { useSubmitTaste } from "@/features/taste/data/use-submit-taste";
import { LoadingTasteSubmission } from "@/features/taste/steps/result/loading";
import { tasteAtom } from "@/atoms";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { initialTasteState } from "@/features/taste/state";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

export const Screen = () => {
  const router = useRouter();
  const state = useAtomValue(tasteAtom);
  const setTaste = useSetAtom(tasteAtom);
  const [tasteToSubmit] = useState(state.answers);
  const {
    data,
    isPending: isCurrentUserPending,
    error: currentUserError,
    refetch: refetchCurrentUSer,
  } = useCurrentUser();
  const userId = data?.user?.id ?? null;
  const { trigger, error: submitTasteError } = useSubmitTaste();
  const { taste } = useAnalytics();

  const submitTaste = useCallback(async () => {
    try {
      await Promise.all([
        trigger(tasteToSubmit),
        new Promise<void>((finish) => setTimeout(finish, 5000)), // for the loading animation
      ]);
    } catch {
      return;
    }

    taste.trackSubmitted();

    if (userId === null) {
      setTaste((draft) => {
        draft.completed = true;
      });
      router.replace({
        pathname: "/auth",
        params: { returnTo: "/home" },
      });
    } else {
      setTaste(initialTasteState());
      router.replace("/home");
    }
  }, [userId, setTaste, tasteToSubmit, trigger, router, taste]);

  useEffect(() => {
    if (!isCurrentUserPending && !currentUserError) void submitTaste();
  }, [isCurrentUserPending, currentUserError, submitTaste]);

  return (
    <SafeAreaView
      className={"flex flex-1 flex-col px-4"}
      edges={["top", "bottom"]}
    >
      {submitTasteError || currentUserError ? (
        <ErrorState
          tryAgain={currentUserError ? refetchCurrentUSer : submitTaste}
          error={
            "We couldn't save your taste. Check your connection and try again."
          }
        />
      ) : (
        <LoadingTasteSubmission />
      )}
    </SafeAreaView>
  );
};
