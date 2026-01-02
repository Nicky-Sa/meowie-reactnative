import { useTokensClearedEvent } from "@/features/common/event-emitting/events/useTokensClearedEvent";

export const useEventListener = () => {
  useTokensClearedEvent();
};
