import LottieView from "lottie-react-native";
import { View } from "react-native";
import { useLottieFrame } from "@/features/common/hooks/use-lottie-frame";
import ratingSliderAnimation from "@/assets/lottie/ratings/rating-slider-lottie.json";

type Props = {
  value: number | null;
};

const TOTAL_FACES = 11;
const FRAMES_PER_FACE = 20;
const TOTAL_FRAMES = 201;

// first 1-10 ratings, and skip is the last one.
export const RatingSliderLottie = ({ value }: Props) => {
  const { lottieRef, progress } = useLottieFrame({
    frame: ((value ?? TOTAL_FACES) - 1) * FRAMES_PER_FACE,
    totalFrames: TOTAL_FRAMES,
  });

  return (
    <View className={"h-36 w-36 items-center justify-center"}>
      <LottieView
        ref={lottieRef}
        source={ratingSliderAnimation}
        loop={false}
        autoPlay={false}
        progress={progress}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};
