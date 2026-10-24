import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";

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

  return {
    lottieRef,
    // Seeds the starting frame so it is right on the first painted frame.
    progress: startingFrame / totalFrames,
  };
};
