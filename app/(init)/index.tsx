import { SplashScreen } from "@/features/general/splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
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

  useEffect(() => {
    if (!splashDone) return;

    const checkState = async () => {
      const onBoarded = appStorage.getItem(APP_STORAGE_KEYS.ONBOARDED);

      if (onBoarded === null) {
        // not onboarded
        router.replace("/onboarding");
      } else {
        // onboarded
        // check if authenticated
        if (data?.user) {
          router.replace("/home");
        } else {
          // not authenticated
          Emitter.emit("sessionDestroyed");
          // check skipped-auth
          const skippedAuth = appStorage.getItem(APP_STORAGE_KEYS.SKIPPED_AUTH);
          if (skippedAuth === "true") {
            router.replace("/home");
          } else {
            router.replace("/auth");
          }
        }
      }
    };

    void checkState();
  }, [data?.user, router, splashDone]);

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
