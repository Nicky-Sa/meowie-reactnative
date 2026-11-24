import { Action } from "@/features/common/ui/action";
import { Switch } from "@/features/common/ui/switch";
import { useNotificationsToggle } from "@/features/general/notifications/hooks/use-notifications-toggle";

export const NotificationsToggle = () => {
  const { isOn, toggle } = useNotificationsToggle();

  return (
    <Action
      onPress={toggle}
      icon={<Switch value={isOn} onValueChange={toggle} />}
    >
      Notification
    </Action>
  );
};
