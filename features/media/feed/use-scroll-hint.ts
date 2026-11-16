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
import { homeTourSeenAtom, scrollHintSeenAtom } from "@/atoms";
import { MediaListItemData } from "@/features/media/components/list/types";

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
  const [scrollHintSeen, setScrollHintSeen] = useAtom(scrollHintSeenAtom);
  const [isStopped, setIsStopped] = useState(false);
  const offset = useSharedValue(0);
  const isPlaying = useSharedValue(false);

  const canPlay =
    homeTourSeen &&
    !scrollHintSeen &&
    !isStopped &&
    hasNextItem &&
    currentIndex === 0;

  // A user who has scrolled to another card already knows how, so the hint never plays after that
  useEffect(() => {
    if (currentIndex > 0) setScrollHintSeen(true);
  }, [currentIndex, setScrollHintSeen]);

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
      isPlaying.value = true;
      // Reanimated skips animations under Reduce Motion by default, but these users need the hint too.
      offset.value = withSequence(
        withTiming(PEEK_OFFSET, {
          duration: PEEK_MS,
          easing: Easing.out(Easing.ease),
          reduceMotion: ReduceMotion.Never,
        }),
        withSpring(
          0,
          {
            duration: SETTLE_MS,
            dampingRatio: SETTLE_DAMPING_RATIO,
            reduceMotion: ReduceMotion.Never,
          },
          () => {
            isPlaying.value = false;
          },
        ),
      );
    }, REST_MS);

    return () => clearTimeout(timer);
  }, [canPlay, setScrollHintSeen, isPlaying, offset]);

  const stopScrollHint = useCallback(() => {
    if (canPlay) setIsStopped(true);
    if (!isPlaying.value) return;

    isPlaying.value = false;
    cancelAnimation(offset);
    // Brings the first card back after a tap; a drag takes over from where the feed is.
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [canPlay, isPlaying, offset, listRef]);

  return { stopScrollHint };
};
