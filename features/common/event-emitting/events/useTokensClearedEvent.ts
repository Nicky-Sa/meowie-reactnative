import { useEffect } from "react";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { useRevalidateAuth } from "@/features/general/data/useRevalidateAuth";
import { useEmptySWRCache } from "@/features/general/data/useEmptySWRCache";

export const useTokensClearedEvent = () => {
  const { revalidate } = useRevalidateAuth();
  const { clearSWRCache } = useEmptySWRCache();

  useEffect(() => {
    const subscription = Emitter.addListener("tokensCleared", async () => {
      await revalidate();
      await clearSWRCache();
    });

    return () => {
      subscription.remove();
    };
  }, [clearSWRCache, revalidate]);
};
