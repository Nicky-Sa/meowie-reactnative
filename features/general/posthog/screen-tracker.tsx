import { usePostHog } from "posthog-react-native";
import { usePathname } from "expo-router";
import { PropsWithChildren, useEffect } from "react";

export const ScreenTracker = ({ children }: PropsWithChildren) => {
  const posthog = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && posthog) {
      posthog.screen(pathname).catch((error) => {
        console.log("Error tracking screen: ", error);
      });
    }
  }, [pathname, posthog]);

  return <>{children}</>;
};
