import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  isSaved: boolean;
};

const SAVED_END_FRAME = 75;
const UNSAVED_START_FRAME = 100;
const UNSAVED_END_FRAME = 160;

export const SaveIcon = ({ isSaved }: Props) => {
  const lottieRef = useRef<LottieView>(null);

  const determineInitialAnimation = useCallback(() => {
    if (isSaved) {
      // Play from end frame to end frame to "snap" instantly
      lottieRef.current?.play(SAVED_END_FRAME, SAVED_END_FRAME);
    } else {
      lottieRef.current?.play(UNSAVED_END_FRAME, UNSAVED_END_FRAME);
    }
  }, [isSaved]);

  useEffect(() => {
    if (isSaved) {
      lottieRef.current?.play(0, SAVED_END_FRAME);
    } else {
      lottieRef.current?.play(UNSAVED_START_FRAME, UNSAVED_END_FRAME);
    }
  }, [isSaved]);

  return (
    <LottieView
      ref={lottieRef}
      source={{
        uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/save-lottie.json",
      }}
      resizeMode={"cover"}
      loop={false}
      autoPlay={false}
      onLayout={determineInitialAnimation} // for the rest of the items
      onAnimationLoaded={determineInitialAnimation} // for the first item of the list
      style={{
        width: 24,
        height: 24,
      }}
    />
  );
};
