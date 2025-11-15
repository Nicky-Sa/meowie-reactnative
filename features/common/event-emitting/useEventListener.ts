import { useLogoutEvent } from "@/features/common/event-emitting/events/useLogoutEvent";

export const useEventListener = () => {
  useLogoutEvent();
};
