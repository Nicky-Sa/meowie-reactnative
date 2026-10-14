import { PostHog } from "posthog-react-native";
import { posthogStorage } from "@/features/general/posthog/storage";
import { env } from "@/lib/env";

export const posthog = new PostHog(env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  host: env.EXPO_PUBLIC_POSTHOG_HOST,
  customStorage: posthogStorage,
  captureAppLifecycleEvents: true,
  enableSessionReplay: true,
  errorTracking: {
    autocapture: {
      uncaughtExceptions: true,
      unhandledRejections: true,
    },
  },
  sessionReplayConfig: {
    sampleRate: 0.1,
    maskAllTextInputs: true,
    maskAllImages: true,
  },
});
