import LottieView from "lottie-react-native";
import { View } from "react-native";
import { useLottieFrame } from "@/features/common/hooks/use-lottie-frame";

type Props = {
  level: number;
};

const SOURCE = {
  uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/taste-explore-level.json",
};
const FRAMES_PER_LEVEL = 40;
const TOTAL_FRAMES = 161;

// Five explore-level poses at frames 0/40/80/120/160, one per level.
export const ExploreLevelLottie = ({ level }: Props) => {
  const { lottieRef, progress, onAnimationLoaded } = useLottieFrame({
    frame: level * FRAMES_PER_LEVEL,
    totalFrames: TOTAL_FRAMES,
  });

  return (
    <View className={"h-24 w-24 items-center justify-center"}>
      <LottieView
        ref={lottieRef}
        source={SOURCE}
        loop={false}
        autoPlay={false}
        progress={progress}
        onAnimationLoaded={onAnimationLoaded}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};
