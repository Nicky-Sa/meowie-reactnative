import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

type Props = {
  level: number;
};

const FRAMES_PER_LEVEL = 40;
// The out point of the Lottie file — the frame that a progress of 1 lands on.
const TOTAL_FRAMES = 161;

const SOURCE = {
  uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/taste-explore-level.json",
};

const frameForLevel = (level: number) => level * FRAMES_PER_LEVEL;

/**
 * Single Lottie file with 5 explore-level poses, 40 frames apart
 * (0/40/80/120/160 for levels 0-4). The starting pose comes from `progress` so
 * it is right on the first painted frame, then the slider animates between the
 * old and new frame. Do not gate this on onAnimationLoaded: iOS reuses the
 * native view after a screen is popped, and with the same source URL the
 * animation is never re-loaded, so that callback fires on the first mount only.
 */
export const ExploreLevelLottie = ({ level }: Props) => {
  const lottieRef = useRef<LottieView>(null);
  const [startingLevel] = useState(level);
  const shownLevel = useRef(level);

  useEffect(() => {
    if (shownLevel.current === level) return;
    lottieRef.current?.play(
      frameForLevel(shownLevel.current),
      frameForLevel(level),
    );
    shownLevel.current = level;
  }, [level]);

  // The slider can move while the file is still downloading, and those plays go
  // nowhere — so catch up to the current level once it lands.
  const showCurrentLevel = useCallback(() => {
    const frame = frameForLevel(shownLevel.current);
    lottieRef.current?.play(frame, frame);
  }, []);

  return (
    <View className={"h-24 w-24 items-center justify-center"}>
      <LottieView
        ref={lottieRef}
        source={SOURCE}
        loop={false}
        autoPlay={false}
        progress={frameForLevel(startingLevel) / TOTAL_FRAMES}
        onAnimationLoaded={showCurrentLevel}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};
