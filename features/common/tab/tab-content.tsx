import { ReactNode, useLayoutEffect } from "react";
import { SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { useScrollHandler } from "@/features/common/hooks/list/use-scroll-handler";

type Props = {
  tabName: string;
  headerHeight: number;
  scrollPositions: SharedValue<Record<string, number>>;
  onReady: () => void;
  children: (scroll: ReturnType<typeof useScrollHandler>) => ReactNode;
};

/** Gives one tab its own scroll position, and draws it only once the header is measured. */
export const TabContent = ({
  tabName,
  headerHeight,
  scrollPositions,
  onReady,
  children,
}: Props) => {
  const scroll = useScrollHandler();

  useAnimatedReaction(
    () => scroll.scrollY.value,
    (current) => {
      scrollPositions.value = {
        ...scrollPositions.value,
        [tabName]: current,
      };
    },
  );

  // A layout effect runs before this frame is drawn, so the loading skeleton
  // leaves in the same frame the tab content shows up.
  useLayoutEffect(() => {
    if (headerHeight > 0) onReady();
  }, [headerHeight, onReady]);

  if (headerHeight === 0) return null;

  return children(scroll);
};
