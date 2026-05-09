import { useSessionCreated } from "@/features/common/event-emitting/events/session-created";
import { useSessionDestroyed } from "@/features/common/event-emitting/events/session-destroyed";

export const useEventListener = () => {
  useSessionCreated();
  useSessionDestroyed();
};
