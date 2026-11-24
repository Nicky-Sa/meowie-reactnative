import { PropsWithChildren } from "react";
import { useEventListener } from "@/features/common/event-emitting/use-event-listener";

// It needs to wrap the code below the posthog and query client providers, because its listeners use both
export const EventListenerWrapper = ({ children }: PropsWithChildren) => {
  useEventListener();

  return <>{children}</>;
};
