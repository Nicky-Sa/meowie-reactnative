import { useSessionCreated } from "@/features/common/event-emitting/events/session-created";
import { useSessionDestroyed } from "@/features/common/event-emitting/events/session-destroyed";
import { useAppEnteredForeground } from "@/features/common/event-emitting/events/app-entered-foreground";

export const useEventListener = () => {
  useSessionCreated();
  useSessionDestroyed();
  useAppEnteredForeground();
};
