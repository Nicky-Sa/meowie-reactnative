import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import savedAnimation from "@/assets/lottie/saved-lottie.json";

type Props = {
  isSaved: boolean;
};

const SAVED_END_FRAME = 75;
const UNSAVED_START_FRAME = 100;
const UNSAVED_END_FRAME = 160;
const TOTAL_FRAMES = 160;

export const SaveIcon = ({ isSaved }: Props) => {
  const lottieRef = useRef<LottieView>(null);
  const isFirstMount = useRef(true);
  // Seeds the starting frame so the first painted frame already matches isSaved.
  const [startingProgress] = useState(
    (isSaved ? SAVED_END_FRAME : UNSAVED_END_FRAME) / TOTAL_FRAMES,
  );

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
      <LottieView
        ref={lottieRef}
        source={savedAnimation}
        resizeMode={"cover"}
        loop={false}
        autoPlay={false}
        progress={startingProgress}
        style={{ width: 24, height: 24 }}
      />
    </View>
  );
};
