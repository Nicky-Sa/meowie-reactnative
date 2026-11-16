import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { FlashListRef } from "@shopify/flash-list";
import {
  AnimatedRef,
  cancelAnimation,
  Easing,
  ReduceMotion,
  scrollTo,
  useAnimatedReaction,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  feedFirstScrollTrackedAtom,
  homeTourSeenAtom,
  scrollHintSeenAtom,
  tourEndedAtAtom,
} from "@/atoms";
import { MediaListItemData } from "@/features/media/components/list/types";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";
import { Properties } from "@/features/general/posthog/events/types";

const REST_MS = 800;
const PEEK_OFFSET = 200;
const PEEK_MS = 450;
// Reanimated's spring runs about 1.5 times this perceptual duration, so about 0.6s.
const SETTLE_MS = 400;
const SETTLE_DAMPING_RATIO = 0.5;

type Args = {
  listRef: AnimatedRef<FlashListRef<MediaListItemData>>;
  hasNextItem: boolean;
  currentIndex: number;
};

/** Scrolls the feed up once to show the top of the next movie, then springs back, so new users learn they can scroll. */
export const useScrollHint = ({ listRef, hasNextItem, currentIndex }: Args) => {
  const homeTourSeen = useAtomValue(homeTourSeenAtom);
  const tourEndedAt = useAtomValue(tourEndedAtAtom);
  const [scrollHintSeen, setScrollHintSeen] = useAtom(scrollHintSeenAtom);
  const [feedFirstScrollTracked, setFeedFirstScrollTracked] = useAtom(
    feedFirstScrollTrackedAtom,
  );
  const [isStopped, setIsStopped] = useState(false);
  const offset = useSharedValue(0);
  // Only "peek" or "settle": the wait before them is `canPlay`
  const movingPhase = useSharedValue<
    Properties<"scroll_hint_interrupted">["phase"] | null
  >(null);
  const { scrollHint } = useAnalytics();

  // True during the wait before the peek
  const canPlay =
    homeTourSeen &&
    !scrollHintSeen &&
    !isStopped &&
    hasNextItem &&
    currentIndex === 0;

  useEffect(() => {
    if (currentIndex === 0) return;

    if (!feedFirstScrollTracked) {
      scrollHint.trackFeedFirstScrolled({
        secondsSinceTourEnded:
          tourEndedAt === null
            ? null
            : Math.round((Date.now() - tourEndedAt) / 1000),
        // Read before the line below saves the scroll as seen
        hintShown: scrollHintSeen,
      });
      setFeedFirstScrollTracked(true);
    }
    // A user who has scrolled to another card already knows how, so the hint never plays after that
    setScrollHintSeen(true);
  }, [
    currentIndex,
    feedFirstScrollTracked,
    scrollHint,
    scrollHintSeen,
    setFeedFirstScrollTracked,
    setScrollHintSeen,
    tourEndedAt,
  ]);

  useAnimatedReaction(
    () => offset.value,
    (value, previous) => {
      if (previous === null) return;
      scrollTo(listRef, 0, value, false);
    },
  );

  useEffect(() => {
    if (!canPlay) return;

    const timer = setTimeout(() => {
      setScrollHintSeen(true);
      scrollHint.trackShown();
      movingPhase.value = "peek";
      // Reanimated skips animations under Reduce Motion by default, but these users need the hint too.
      offset.value = withSequence(
        withTiming(
          PEEK_OFFSET,
          {
            duration: PEEK_MS,
            easing: Easing.out(Easing.ease),
            reduceMotion: ReduceMotion.Never,
          },
          (finished) => {
            if (finished) movingPhase.value = "settle";
          },
        ),
        withSpring(
          0,
          {
            duration: SETTLE_MS,
            dampingRatio: SETTLE_DAMPING_RATIO,
            reduceMotion: ReduceMotion.Never,
          },
          () => {
            movingPhase.value = null;
          },
        ),
      );
    }, REST_MS);

    return () => clearTimeout(timer);
  }, [canPlay, setScrollHintSeen, scrollHint, movingPhase, offset]);

  const stopScrollHint = useCallback(() => {
    if (canPlay) {
      setIsStopped(true);
      scrollHint.trackInterrupted({ phase: "rest" });
      return;
    }

    const phase = movingPhase.value;
    if (phase === null) return;

    movingPhase.value = null;
    cancelAnimation(offset);
    scrollHint.trackInterrupted({ phase });
    // Brings the first card back after a tap; a drag takes over from where the feed is.
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [canPlay, scrollHint, movingPhase, offset, listRef]);

  return { stopScrollHint };
};
