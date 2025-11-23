import { View } from "react-native";
import { cn } from "@/lib/utils";

export const SkeletonItem = ({ className }: { className: string }) => {
  return (
    <View
      className={cn("w-full rounded-xl bg-neutral-11-default", className)}
    />
  );
};
