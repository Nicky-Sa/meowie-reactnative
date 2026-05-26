import { SplashScreen } from "@/features/general/splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { AppStorage } from "@/features/common/data/utils/app-storage";
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
      // check if authenticated
      if (data?.user) {
        router.replace("/home");
      } else {
        // not authenticated
        Emitter.emit("sessionDestroyed");
        // check skipped-auth
        const skippedAuth = AppStorage.getItem("skipped-auth");
        if (skippedAuth === "true") {
          router.replace("/home");
        } else {
          router.replace("/auth");
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
