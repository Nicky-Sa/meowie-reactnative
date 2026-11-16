import { PostHog } from "posthog-react-native";
import { posthogStorage } from "@/features/general/posthog/storage";
import { env } from "@/lib/env";

type SentError = { value?: string; stacktrace?: { frames?: unknown[] } };

export const posthog = new PostHog(env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  host: env.EXPO_PUBLIC_POSTHOG_HOST,
  customStorage: posthogStorage,
  captureAppLifecycleEvents: true,
  enableSessionReplay: true,
  errorTracking: {
    autocapture: env.EXPO_PUBLIC_APP_VARIANT !== "development" && {
      uncaughtExceptions: true,
      unhandledRejections: true,
      console: ["error"],
    },
  },
  sessionReplayConfig: {
    sampleRate: 0.1,
    // Our TextInput and the user's email hide themselves with PostHogMaskView.
    maskAllTextInputs: false,
    maskAllImages: false,
  },
  // An error without a stack trace gets its message as fingerprint,
  // so different errors land in separate PostHog issues instead of one.
  before_send: (event) => {
    if (event.event !== "$exception") {
      return event;
    }
    const errors = (event.properties?.$exception_list ?? []) as SentError[];
    const hasStackTrace = errors.some(
      (error) => error.stacktrace?.frames?.length,
    );
    const message = errors.at(0)?.value;
    if (hasStackTrace || !message) {
      return event;
    }
    return {
      ...event,
      properties: { ...event.properties, $exception_fingerprint: message },
    };
  },
});
