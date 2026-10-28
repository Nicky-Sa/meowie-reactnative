import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Bookmark, BookmarkSolid } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import savedAnimation from "@/assets/lottie/saved-lottie.json";

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

  // Keep the static icon visible until Lottie has moved to the correct frame.
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
      {!isLottieReady && (
        <View className="absolute">
          <Icon i={isSaved ? BookmarkSolid : Bookmark} />
        </View>
      )}
      <LottieView
        ref={lottieRef}
        source={savedAnimation}
        resizeMode={"cover"}
        loop={false}
        autoPlay={false}
        onAnimationLoaded={initializeAnimationState}
        style={{
          width: 24,
          height: 24,
          opacity: isLottieReady ? 1 : 0,
        }}
      />
    </View>
  );
};
