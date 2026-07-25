import LottieView from "lottie-react-native";
import { View } from "react-native";
import { useLottieFrame } from "@/features/common/hooks/use-lottie-frame";

type Props = {
  value: number | null;
};

const SOURCE = {
  uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/ratings/rating-slider-lottie.json?v=1",
};
const TOTAL_FACES = 11;
const FRAMES_PER_FACE = 20;
const TOTAL_FRAMES = 201;

// first 1-10 ratings, and skip is the last one.
export const RatingSliderLottie = ({ value }: Props) => {
  const { lottieRef, progress, onAnimationLoaded } = useLottieFrame({
    frame: ((value ?? TOTAL_FACES) - 1) * FRAMES_PER_FACE,
    totalFrames: TOTAL_FRAMES,
  });

  return (
    <View className={"h-36 w-36 items-center justify-center"}>
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
