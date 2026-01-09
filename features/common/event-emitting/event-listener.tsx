import { PropsWithChildren } from "react";
import { useEventListener } from "@/features/common/event-emitting/useEventListener";

export const EventListenerWrapper = ({ children }: PropsWithChildren) => {
  useEventListener();

  return <>{children}</>;
};
