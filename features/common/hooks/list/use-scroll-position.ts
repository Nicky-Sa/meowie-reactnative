import {
  ScrollEvent,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type Args = {
  /** Must be a worklet, because it runs inside the scroll handler. */
  onMomentumEnd?: (event: ScrollEvent) => void;
};

export const useScrollPosition = ({ onMomentumEnd }: Args = {}) => {
  const scrollY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onBeginDrag: () => {
      isDragging.value = true;
    },
    onEndDrag: () => {
      isDragging.value = false;
    },
    onMomentumEnd: (event) => {
      onMomentumEnd?.(event);
    },
  });

  return { scrollHandler, scrollY, isDragging };
};
