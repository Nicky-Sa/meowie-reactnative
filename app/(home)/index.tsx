import { SplashScreen } from "@/features/movies/layout/splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "@expo-google-fonts/lato";
import * as Lato from "@expo-google-fonts/lato";
import { useIsAuthenticated } from "@/features/general/data/useIsAuthenticated";

export default function Home() {
  const [loaded] = useFonts(Lato);
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const { data } = useIsAuthenticated();

  useEffect(() => {
    if (!splashDone) return;

    AsyncStorage.getItem("onboarded").then((onBoarded) => {
      if (onBoarded === null) {
        // not onboarded
        router.replace("/onboarding");
      } else {
        // onboarded
        AsyncStorage.getItem("skipped-auth").then((skippedAuth) => {
          // skipped-auth
          if (skippedAuth === "true") {
            router.replace("/(tabs)/movies");
          } else {
            // not skipped-auth -> check if authenticated
            if (data?.isAuthenticated) {
              router.replace("/(tabs)/movies");
            }
            // if not authenticated -> interceptor will redirect to login
          }
        });
      }
    });
  }, [data?.isAuthenticated, router, splashDone]);

  return (
    <>
      <SplashScreen onFinish={() => setSplashDone(true)} isLoading={!loaded} />
    </>
  );
}
