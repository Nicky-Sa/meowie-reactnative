import { SplashScreen } from "@/features/general/splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useStore } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import { useLatoFont } from "@/assets/fonts/Lato";
import { useMaziusFonts } from "@/assets/fonts/MaziusDisplay";

export default function Home() {
  const [latoLoaded] = useLatoFont();
  const [maziusLoaded] = useMaziusFonts();
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const { data, isPending } = useCurrentUser();
  // Not useAtom: clearing the link would re-run the effect below and replace the screen it just opened.
  const store = useStore();

  useEffect(() => {
    if (!splashDone) return;

    const checkState = () => {
      const onBoarded = appStorage.getItem(APP_STORAGE_KEYS.ONBOARDED);

      if (onBoarded === null) {
        // not onboarded
        router.replace("/onboarding");
      } else {
        // onboarded
        // check if authenticated
        if (data && !data.user) {
          // not authenticated
          Emitter.emit("sessionDestroyed");
        }
        // if onboarded -> home
        router.replace("/home");

        const linkToOpen = store.get(linkToOpenAtom);
        if (linkToOpen) {
          store.set(linkToOpenAtom, null);
          router.push(linkToOpen);
        }
      }
    };

    checkState();
  }, [data, router, splashDone, store]);

  const onFinish = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <SplashScreen
        onFinish={onFinish}
        isLoading={!latoLoaded || !maziusLoaded || isPending}
      />
    </>
  );
}
