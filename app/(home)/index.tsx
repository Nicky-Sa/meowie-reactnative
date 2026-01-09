import { SplashScreen } from "@/features/general/splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "@expo-google-fonts/lato";
import * as Lato from "@expo-google-fonts/lato";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { Emitter } from "@/features/common/event-emitting/emitter";

export default function Home() {
  const [loaded] = useFonts(Lato);
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const { data } = useCurrentUser();

  useEffect(() => {
    if (!splashDone) return;

    AsyncStorage.getItem("onboarded").then((onBoarded) => {
      if (onBoarded === null) {
        // not onboarded
        router.replace("/onboarding");
      } else {
        // onboarded
        AsyncStorage.getItem("skipped-auth").then((skippedAuth) => {
          // check if authenticated
          if (data?.user) {
            router.replace("/movies");
          } else {
            // not authenticated
            Emitter.emit("userUnregistered");
            // check skipped-auth
            if (skippedAuth === "true") {
              router.replace("/movies");
            } else {
              router.replace("/auth/request-otp");
            }
          }
        });
      }
    });
  }, [data?.user, router, splashDone]);

  return (
    <>
      <SplashScreen onFinish={() => setSplashDone(true)} isLoading={!loaded} />
    </>
  );
}
