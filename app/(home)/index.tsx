import { SplashScreen } from "@/features/general/splash-screen";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "@expo-google-fonts/lato";
import * as Lato from "@expo-google-fonts/lato";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { AppStorage } from "@/features/common/data/utils/app-storage";

export default function Home() {
  const [loaded] = useFonts(Lato);
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const { data, isPending } = useCurrentUser();

  useEffect(() => {
    if (!splashDone) return;

    const checkState = async () => {
      const onBoarded = await AppStorage.getItem("onboarded");

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
          Emitter.emit("userUnregistered");
          // check skipped-auth
          const skippedAuth = await AppStorage.getItem("skipped-auth");
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

  return (
    <>
      <SplashScreen
        onFinish={() => setSplashDone(true)}
        isLoading={!loaded || isPending}
      />
    </>
  );
}
