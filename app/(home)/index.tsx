import { SplashScreen } from "@/components/movies/layout/splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (!splashDone) return;

    AsyncStorage.getItem("onboarded").then((value) => {
      if (value === null) {
        // not onboarded
        router.replace("/onboarding");
      } else {
        // onboarded
        router.replace("/movies");
      }
    });
  }, [router, splashDone]);

  return (
    <>
      <SplashScreen onFinish={() => setSplashDone(true)} />
    </>
  );
}
