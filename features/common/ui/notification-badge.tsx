import { View } from "react-native";
import { cn } from "@/lib/tailwind";

type Props = {
  className?: string; // to position the badge
};

export const NotificationBadge = ({ className }: Props) => {
  return (
    <View
      className={cn(
        className,
        "absolute h-2.5 w-2.5 rounded-full bg-brand-1-default",
      )}
    />
  );
};
