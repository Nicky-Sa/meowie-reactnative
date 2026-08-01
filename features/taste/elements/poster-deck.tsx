import { forwardRef, useImperativeHandle, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { PosterCard } from "@/features/common/posters/poster-card";
import { Title } from "@/features/taste/data/dto/journey.dto";
import { tailwind } from "@/lib/tailwind";

const POSTER_RATIO = 2 / 3;
const CARD_RADIUS = Number(tailwind.theme.borderRadius["2xl"]);

const PEEK_STEP = 28;
const SCALE_STEP = 0.06;
const CARDS_BEHIND = 2;

const COMMIT_FRACTION = 0.22;
const FLICK_SPEED = 700;

// Damped just past the point where it would swing back, so cards glide in
// without a bounce. `position` counts cards, so the rest limits must be tiny.
const SPRING = {
  damping: 24,
  stiffness: 180,
  mass: 0.7,
  overshootClamping: true,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.01,
};

export type PosterDeckHandle = { showNext: () => void };

type Props = {
  items: Title[];
  onShow: (index: number) => void;
};

// `position` is where the deck sits measured in cards: 3.4 is being dragged
// from the fourth poster to the fifth. `topIndex` only picks what's mounted.
export const PosterDeck = forwardRef<PosterDeckHandle, Props>(
  ({ items, onShow }, ref) => {
    const [topIndex, setTopIndex] = useState(0);
    const [area, setArea] = useState({ width: 0, height: 0 });
    const position = useSharedValue(0);
    const dragStart = useSharedValue(0);

    const stackHeight = PEEK_STEP * CARDS_BEHIND;
    // Whole pixels: fractional card sizes drift apart as the stack moves.
    const cardWidth = Math.floor(
      Math.min((area.height - stackHeight) * POSTER_RATIO, area.width),
    );
    const cardHeight = Math.floor(cardWidth / POSTER_RATIO);
    const lastIndex = items.length - 1;

    const settleOn = (index: number) => {
      setTopIndex(index);
      onShow(index);
    };

    const goTo = (index: number) => {
      const wanted = Math.min(Math.max(index, 0), lastIndex);
      position.value = withSpring(wanted, SPRING);
      settleOn(wanted);
    };

    useImperativeHandle(ref, () => ({ showNext: () => goTo(topIndex + 1) }));

    const onLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setArea({ width, height });
    };

    const flick = Gesture.Pan()
      .activeOffsetY([-8, 8])
      // Let a sideways drag through, so the iOS back swipe still works.
      .failOffsetX([-20, 20])
      .onBegin(() => {
        cancelAnimation(position);
        dragStart.value = Math.round(position.value);
      })
      .onUpdate((event) => {
        const moved = dragStart.value - event.translationY / cardHeight;
        position.value = Math.min(Math.max(moved, 0), lastIndex);
      })
      .onEnd((event) => {
        const moved = position.value - dragStart.value;
        const movedOn =
          moved > COMMIT_FRACTION || event.velocityY < -FLICK_SPEED;
        const movedBack =
          moved < -COMMIT_FRACTION || event.velocityY > FLICK_SPEED;

        const step = movedOn ? 1 : movedBack ? -1 : 0;
        const wanted = Math.min(Math.max(dragStart.value + step, 0), lastIndex);

        // Sprung here, not in `goTo`, so it starts without a hop to the JS thread.
        position.value = withSpring(wanted, SPRING);
        scheduleOnRN(settleOn, wanted);
      });

    if (cardWidth <= 0 || items.length === 0) {
      return <View className={"flex-1"} onLayout={onLayout} />;
    }

    // One card back, so flicking down has something to pull in.
    const mounted = items
      .map((item, index) => ({ item, index }))
      .filter(
        ({ index }) =>
          index >= topIndex - 1 && index <= topIndex + CARDS_BEHIND,
      );

    return (
      <View
        className={"flex-1 items-center justify-center"}
        onLayout={onLayout}
      >
        <GestureDetector gesture={flick}>
          <View style={{ width: cardWidth, height: cardHeight + stackHeight }}>
            {mounted.map(({ item, index }) => (
              <DeckCard
                key={item.tmdbId}
                item={item}
                index={index}
                position={position}
                width={cardWidth}
                height={cardHeight}
                depth={items.length - index}
              />
            ))}
          </View>
        </GestureDetector>
      </View>
    );
  },
);

PosterDeck.displayName = "PosterDeck";

type CardProps = {
  item: Title;
  index: number;
  position: SharedValue<number>;
  width: number;
  height: number;
  depth: number;
};

const DeckCard = ({
  item,
  index,
  position,
  width,
  height,
  depth,
}: CardProps) => {
  const style = useAnimatedStyle(() => {
    // 0 is the front card, 1 peeks behind it, -1 is leaving off the top.
    const place = index - position.value;

    return {
      opacity: interpolate(
        place,
        [-1, -0.35, 0],
        [0, 1, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            place,
            [-1, 0, 1, 2],
            [-height, 0, PEEK_STEP, PEEK_STEP * 2],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            place,
            [-1, 0, 1, 2],
            [1, 1, 1 - SCALE_STEP, 1 - SCALE_STEP * 2],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    // Solid backing: while the poster loads the card would be see-through,
    // showing the movie stacked behind it until the image lands on top.
    <Animated.View
      className={
        "absolute left-0 top-0 overflow-hidden rounded-2xl border border-neutral-3-default bg-neutral-12-default"
      }
      style={[{ width, height, zIndex: depth }, style]}
    >
      <PosterCard
        posterUri={item.poster}
        width={width}
        title={item.title}
        borderRadius={CARD_RADIUS}
        showDetails
        detailsSize={"large"}
        subtitle={item.year}
      />
    </Animated.View>
  );
};
