import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";

type Props = {
  rating: number | "skip";
  play?: boolean;
};

const SIZE = 24;

export const RatingLottie = ({ rating, play = false }: Props) => {
  const lottieRef = useRef<LottieView>(null);
  const playRef = useRef(play);

  const uri = `https://meowie-public.s3.eu-central-1.amazonaws.com/ratings/rating-${rating}-lottie.json?v=1`;

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
        source={{ uri }}
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
