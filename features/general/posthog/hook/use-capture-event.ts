import { usePostHog } from "posthog-react-native";
import { Event, Properties } from "@/features/general/posthog/events";
import { useCallback } from "react";

type CaptureArgs<E extends Event> =
  undefined extends Properties<E>
    ? // Case 1: Properties are undefined -> We assume the second argument is optional/not needed.
      [event: E, properties?: Properties<E>]
    : // Case 2: Properties are defined -> The second argument is required.
      [event: E, properties: Properties<E>];

export const useCaptureEvent = () => {
  const posthog = usePostHog();

  const capture = useCallback(
    <E extends Event>(...args: CaptureArgs<E>) => {
      const [event, properties] = args;
      try {
        posthog.capture(event, properties);
      } catch (error) {
        console.error("Error capturing event: ", error);
      }
    },
    [posthog],
  );

  return { capture };
};
