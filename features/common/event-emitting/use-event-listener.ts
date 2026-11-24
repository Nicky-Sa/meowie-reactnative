import { useSessionCreated } from "@/features/common/event-emitting/events/session-created";
import { useSessionDestroyed } from "@/features/common/event-emitting/events/session-destroyed";
import { useAppEnteredForeground } from "@/features/common/event-emitting/events/app-entered-foreground";
import { useNotificationTapped } from "@/features/common/event-emitting/events/notification-tapped";

export const useEventListener = () => {
  useSessionCreated();
  useSessionDestroyed();
  useAppEnteredForeground();
  useNotificationTapped();
};
