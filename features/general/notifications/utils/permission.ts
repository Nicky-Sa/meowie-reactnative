import { NotificationsState } from "@/features/general/posthog/events/types";

/** iOS gives the permission as true or false, while the PostHog events send it as "on" or "off". */
export const toNotificationsState = (granted: boolean): NotificationsState =>
  granted ? "on" : "off";
