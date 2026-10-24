import LottieView, { AnimationObject } from "lottie-react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import skipAnimation from "@/assets/lottie/ratings/skip-lottie.json";
import rating1Animation from "@/assets/lottie/ratings/1-lottie.json";
import rating2Animation from "@/assets/lottie/ratings/2-lottie.json";
import rating3Animation from "@/assets/lottie/ratings/3-lottie.json";
import rating4Animation from "@/assets/lottie/ratings/4-lottie.json";
import rating5Animation from "@/assets/lottie/ratings/5-lottie.json";
import rating6Animation from "@/assets/lottie/ratings/6-lottie.json";
import rating7Animation from "@/assets/lottie/ratings/7-lottie.json";
import rating8Animation from "@/assets/lottie/ratings/8-lottie.json";
import rating9Animation from "@/assets/lottie/ratings/9-lottie.json";
import rating10Animation from "@/assets/lottie/ratings/10-lottie.json";

type Props = {
  rating: number | null;
  play?: boolean;
};

const SIZE = 24;

const ratingAnimations: Record<number, AnimationObject> = {
  1: rating1Animation,
  2: rating2Animation,
  3: rating3Animation,
  4: rating4Animation,
  5: rating5Animation,
  6: rating6Animation,
  7: rating7Animation,
  8: rating8Animation,
  9: rating9Animation,
  10: rating10Animation,
};

export const RatingLottie = ({ rating, play = false }: Props) => {
  const lottieRef = useRef<LottieView>(null);
  const playRef = useRef(play);

  // No rating means the user skipped it, which has its own file.
  const animation = rating === null ? skipAnimation : ratingAnimations[rating];

  useEffect(() => {
    if (play !== playRef.current) {
      if (play) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.reset();
      }
    }
    playRef.current = play;
  }, [play, rating]);

  return (
    <View
      className="items-center justify-center overflow-visible"
      style={{
        width: SIZE,
        height: SIZE,
      }}
    >
      <LottieView
        ref={lottieRef}
        source={animation}
        style={{
          width: SIZE * 2,
          height: SIZE * 2,
          position: "absolute",
        }}
        loop={false}
        autoPlay={play}
      />
    </View>
  );
};
