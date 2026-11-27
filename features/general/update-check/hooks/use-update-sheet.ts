import { useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { allowYTPlayingAtom, skippedUpdateVersionAtom } from "@/atoms";
import { ExposedBottomSheetModalRef } from "@/features/common/ui/bottom-sheet";
import { useVersionCheck } from "@/features/general/update-check/hooks/use-version-check";

/** Opens the sheet while a newer App Store version is out that the person hasn't skipped. */
export const useUpdateSheet = () => {
  const sheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const { updateState, latestVersion } = useVersionCheck();
  const [skippedVersion, setSkippedVersion] = useAtom(skippedUpdateVersionAtom);
  const setAllowYTPlaying = useSetAtom(allowYTPlayingAtom);

  const isUpdateWaiting =
    updateState === "available" && latestVersion !== skippedVersion;

  useEffect(() => {
    if (!isUpdateWaiting) return;
    setAllowYTPlaying(false);
    sheetRef.current?.present();
  }, [isUpdateWaiting, setAllowYTPlaying]);

  const close = () => sheetRef.current?.dismiss();

  // Closing the sheet in any way counts as "Later".
  const onDismiss = () => {
    setAllowYTPlaying(true);
    setSkippedVersion(latestVersion ?? "");
  };

  return { sheetRef, close, onDismiss };
};
