import { View } from "react-native";
import { cn } from "@/lib/tailwind";

type Props = {
  className: string;
  style?: object;
};

export const SkeletonItem = ({ className, style }: Props) => {
  return (
    <View
      className={cn(
        "w-full animate-pulse rounded-xl bg-neutral-11-default",
        className,
      )}
      style={style}
    />
  );
};
