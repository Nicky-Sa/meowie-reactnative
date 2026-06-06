import { PropsWithChildren } from "react";
import { useEventListener } from "@/features/common/event-emitting/use-event-listener";

// It needs to wrap the code below posthog provider to be able to access the posthog instance
export const EventListenerWrapper = ({ children }: PropsWithChildren) => {
  useEventListener();

  return <>{children}</>;
};
