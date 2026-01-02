import { useEffect } from "react";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { useRevalidateAuth } from "@/features/general/data/useRevalidateAuth";

export const useTokensClearedEvent = () => {
  const { revalidate } = useRevalidateAuth();

  useEffect(() => {
    const subscription = Emitter.addListener("tokensCleared", async () => {
      await revalidate();
    });

    return () => {
      subscription.remove();
    };
  }, [revalidate]);
};
