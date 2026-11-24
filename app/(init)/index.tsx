import { SplashScreen } from "@/features/general/splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useStore } from "jotai";
import { usePostHog } from "posthog-react-native";
import { linkToOpenAtom } from "@/atoms";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useSavePushToken } from "@/features/general/notifications/data/use-save-push-token";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import { useLatoFont } from "@/assets/fonts/Lato";
import { useMaziusFonts } from "@/assets/fonts/MaziusDisplay";

export default function Home() {
  const [latoLoaded] = useLatoFont();
  const [maziusLoaded] = useMaziusFonts();
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);
  const { data, isPending, failureCount } = useCurrentUser();
  // The splash waits for the first try only, so a slow backend can't hold it for all the retries.
  const isUserLoading = isPending && failureCount === 0;
  // Not useAtom: clearing the link would re-run the effect below and replace the screen it just opened.
  const store = useStore();
  const posthog = usePostHog();
  const { savePushToken } = useSavePushToken();

  useEffect(() => {
    if (!splashDone) return;

    const checkState = () => {
      // savePushToken logs its own errors, so its promise is safe to drop,
      // plus we don't want to hang the check for the promise to settle, so it's a fire and move on
      void savePushToken();

      const onBoarded = appStorage.getItem(APP_STORAGE_KEYS.ONBOARDED);

      if (onBoarded === null) {
        // not onboarded
        if (data && !data.user) {
          // Marking a fresh installation as guest in posthog
          posthog.register({ is_guest: true }).catch((error) => {
            console.error("Could not register the guest in PostHog:", error);
          });
        }
        router.replace("/onboarding");
      } else {
        // onboarded
        // check if authenticated
        if (data && !data.user) {
          // not authenticated
          posthog.register({ is_guest: true }).catch((error) => {
            console.error("Could not register the guest in PostHog:", error);
          });
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
  }, [data, router, splashDone, store, posthog, savePushToken]);

  const onFinish = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <SplashScreen
        onFinish={onFinish}
        isLoading={!latoLoaded || !maziusLoaded || isUserLoading}
      />
    </>
  );
}
