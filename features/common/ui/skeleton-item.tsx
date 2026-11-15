import Animated from "react-native-reanimated";
import { cn } from "@/lib/tailwind";
import { useOpacityPulse } from "@/features/common/hooks/use-opacity-pulse";

type Props = {
  className: string;
  style?: object;
};

// Not NativeWind's `animate-pulse`, because it writes to Reanimated values while drawing.
export const SkeletonItem = ({ className, style }: Props) => {
  const pulseStyle = useOpacityPulse();

  return (
    <Animated.View
      className={cn("w-full rounded-xl bg-neutral-11-default", className)}
      style={[pulseStyle, style]}
    />
  );
};
