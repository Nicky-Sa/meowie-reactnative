import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Bookmark, BookmarkSolid } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";

type Props = {
  isSaved: boolean;
};

const SAVED_END_FRAME = 75;
const UNSAVED_START_FRAME = 100;
const UNSAVED_END_FRAME = 160;

export const SaveIcon = ({ isSaved }: Props) => {
  const lottieRef = useRef<LottieView>(null);
  const isFirstMount = useRef(true);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const isLottieReadyRef = useRef(false);

  const initializeAnimationState = useCallback(() => {
    if (isSaved) {
      lottieRef.current?.play(SAVED_END_FRAME, SAVED_END_FRAME);
    } else {
      lottieRef.current?.play(UNSAVED_END_FRAME, UNSAVED_END_FRAME);
    }

    if (!isLottieReadyRef.current) {
      isLottieReadyRef.current = true;
      setIsLottieReady(true);
    }
  }, [isSaved]);

  // Fallback: If onAnimationLoaded fails to fire (e.g. cached animation remounting),
  // forcefully initialize the animation state after a short delay.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLottieReadyRef.current) {
        initializeAnimationState();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [initializeAnimationState]);

  const playTransitionAnimation = useCallback(() => {
    if (isSaved) {
      lottieRef.current?.play(0, SAVED_END_FRAME);
    } else {
      lottieRef.current?.play(UNSAVED_START_FRAME, UNSAVED_END_FRAME);
    }
  }, [isSaved]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    playTransitionAnimation();
  }, [playTransitionAnimation]);

  return (
    <View className="h-6 w-6 items-center justify-center">
      {/* Static fallback while the Lottie loads from S3 */}
      {!isLottieReady && <Icon i={isSaved ? BookmarkSolid : Bookmark} />}

      {/* Lottie — hidden until loaded to prevent frame-0 flash */}
      <LottieView
        ref={lottieRef}
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/saved-lottie.json?v=1",
        }}
        resizeMode={"cover"}
        loop={false}
        autoPlay={false}
        onAnimationLoaded={initializeAnimationState} // Primary: fires when the Lottie JSON is parsed and ready
        style={{
          width: 24,
          height: 24,
          opacity: isLottieReady ? 1 : 0,
        }}
      />
    </View>
  );
};
