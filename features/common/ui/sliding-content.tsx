import { PropsWithChildren } from "react";
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useIsInitialRender } from "@/features/common/hooks/use-is-initial-render";

type Props = {
  isActive: boolean;
  slideDirection: "left" | "right";
  className?: string;
};

export const SlidingContent = ({
  isActive,
  slideDirection,
  children,
  className,
}: PropsWithChildren<Props>) => {
  const isInitialRender = useIsInitialRender();

  if (!isActive) return null;

  const entering = slideDirection === "left" ? SlideInLeft : SlideInRight;
  const exiting = slideDirection === "left" ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View
      entering={isInitialRender ? undefined : entering.duration(300)}
      exiting={exiting.duration(300)}
      className={className}
    >
      {children}
    </Animated.View>
  );
};
