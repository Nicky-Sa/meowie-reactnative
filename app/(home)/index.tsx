import { SplashScreen } from "@/features/general/splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { AppStorage } from "@/features/common/data/utils/app-storage";
import { latoFonts, useLatoFont } from "@/assets/fonts/Lato";

export default function Home() {
  const [loaded] = useLatoFont(latoFonts);
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const { data, isPending } = useCurrentUser();

  useEffect(() => {
    if (!splashDone) return;

    const checkState = async () => {
      const onBoarded = AppStorage.getItem("onboarded");

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
          const skippedAuth = AppStorage.getItem("skipped-auth");
          if (skippedAuth === "true") {
            router.replace("/home");
          } else {
            router.replace("/auth/request-otp");
          }
        }
      }
    };

    checkState();
  }, [data?.user, router, splashDone]);

  const onFinish = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <SplashScreen onFinish={onFinish} isLoading={!loaded || isPending} />
    </>
  );
}
