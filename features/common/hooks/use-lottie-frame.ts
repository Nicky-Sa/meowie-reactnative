import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";

type Args = {
  frame: number;
  // The out point of the file — the frame a progress of 1 lands on.
  totalFrames: number;
};

/**
 * Holds one Lottie file on a still frame, animating from the old frame to the
 * new one whenever `frame` changes.
 */
export const useLottieFrame = ({ frame, totalFrames }: Args) => {
  const lottieRef = useRef<LottieView>(null);
  const [startingFrame] = useState(frame);
  const shownFrame = useRef(frame);

  useEffect(() => {
    if (shownFrame.current === frame) return;
    lottieRef.current?.play(shownFrame.current, frame);
    shownFrame.current = frame;
  }, [frame]);

  // The frame can change while the file is still downloading, and those plays
  // go nowhere — so catch up to the current frame once it lands.
  const onAnimationLoaded = useCallback(() => {
    lottieRef.current?.play(shownFrame.current, shownFrame.current);
  }, []);

  return {
    lottieRef,
    // Seeds the starting frame so it is right on the first painted frame. Do
    // not gate rendering on onAnimationLoaded instead: iOS reuses the native
    // view after a screen is popped and never re-loads the same source URL, so
    // that callback fires on the first mount only.
    progress: startingFrame / totalFrames,
    onAnimationLoaded,
  };
};
