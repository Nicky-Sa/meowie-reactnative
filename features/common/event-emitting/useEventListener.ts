import { useUserRegistered } from "@/features/common/event-emitting/events/user-registered";
import { useUserUnregistered } from "@/features/common/event-emitting/events/user-unregistered";

export const useEventListener = () => {
  useUserRegistered();
  useUserUnregistered();
};
