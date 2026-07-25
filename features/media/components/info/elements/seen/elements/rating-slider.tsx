import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  ITEM_WIDTH,
  RatingButton,
} from "@/features/media/components/info/elements/seen/elements/rating-button";

const HIGHEST_RATING = 10;

// `null` is the Skip choice and comes first, so the strip reads Skip, 1 … 10.
const CHOICES: (number | null)[] = [
  ...Array.from({ length: HIGHEST_RATING }, (_unused, index) => index + 1),
  null,
];

export const DEFAULT_RATING = 10;

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
};

export const RatingSlider = ({ value, onChange }: Props) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);
  const centeredIndex = useSharedValue(CHOICES.indexOf(value));
  // Which choice the strip is parked on, so an incoming value that the strip
  // itself reported does not bounce it back.
  const shownIndex = useRef(-1);
  const [width, setWidth] = useState(0);

  const scrollToIndex = useCallback(
    (index: number, animated: boolean) => {
      scrollRef.current?.scrollTo({ x: index * ITEM_WIDTH, animated });
    },
    [scrollRef],
  );

  const reportChoice = useCallback(
    (index: number) => {
      shownIndex.current = index;
      void Haptics.selectionAsync();
      onChange(CHOICES[index]);
    },
    [onChange],
  );

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        scrollOffset.value = event.contentOffset.x;
        const index = Math.round(event.contentOffset.x / ITEM_WIDTH);
        if (index === centeredIndex.value) return;
        if (index < 0 || index >= CHOICES.length) return;
        centeredIndex.value = index;
        scheduleOnRN(reportChoice, index);
      },
    },
    [reportChoice],
  );

  useEffect(() => {
    if (width === 0) return;
    const index = CHOICES.indexOf(value);
    if (index === shownIndex.current) return;
    shownIndex.current = index;
    centeredIndex.value = index;
    scrollOffset.value = index * ITEM_WIDTH;
    scrollToIndex(index, false);
  }, [value, width, centeredIndex, scrollOffset, scrollToIndex]);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH}
      decelerationRate={"fast"}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      contentContainerStyle={{
        paddingHorizontal: Math.max((width - ITEM_WIDTH) / 2, 0),
      }}
    >
      {CHOICES.map((choice, index) => (
        <RatingButton
          key={choice ?? "X"}
          label={choice === null ? "X" : String(choice)}
          index={index}
          scrollOffset={scrollOffset}
          onPress={() => scrollToIndex(index, true)}
        />
      ))}
    </Animated.ScrollView>
  );
};
