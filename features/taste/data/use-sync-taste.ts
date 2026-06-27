import { useAtom } from "jotai";
import { tasteKeywordsAtom, tasteFlexibilityAtom } from "@/atoms";
import { useUpsertTaste } from "@/features/taste/data/use-upsert-taste";
import { useInvalidateByPattern } from "@/features/common/data/query/hooks";
import Toast from "react-native-toast-message";

/**
 * Syncs in-memory taste data to the backend.
 * Called after auth success to push any pending taste selections.
 * No-ops if there is no pending taste data.
 *
 * The taste atoms are in-memory (atomWithImmer), which survive
 * across navigation within the same app session (taste → auth → home).
 */
export const useSyncTaste = () => {
  const [keywords, setKeywords] = useAtom(tasteKeywordsAtom);
  const [flexibility, setFlexibility] = useAtom(tasteFlexibilityAtom);
  const { upsertTaste } = useUpsertTaste();
  const { invalidateByPattern } = useInvalidateByPattern();

  const syncTaste = async () => {
    // No pending taste data — nothing to sync
    if (keywords.length === 0 || !flexibility) return;
    try {
      await upsertTaste(keywords, flexibility);

      Toast.show({
        type: "success",
        text1: "Your taste has been successfully saved.🎉",
      });

      // Clear taste data after successful sync
      setKeywords([]);
      setFlexibility("");

      // Invalidate caches so hasFilledInTaste and saved taste are up to date
      await invalidateByPattern(/\/user\/current/);
      await invalidateByPattern(/\/taste/);
      await invalidateByPattern(/\/feed/);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Something with saving tastes went wrong!",
      });
    }
  };

  return { syncTaste };
};
