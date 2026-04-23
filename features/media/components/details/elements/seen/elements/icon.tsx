import { Eye } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { RatingLottie } from "@/features/media/components/details/elements/seen/elements/rating-lottie";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Props = {
  isSeen: boolean;
  rating: number | null | undefined;
};

export const SeenIcon = ({ isSeen, rating }: Props) => {
  const [play, setPlay] = useState(false);
  const prevRating = useRef(rating);
  const prevSeen = useRef(isSeen);

  useEffect(() => {
    if (isSeen !== prevSeen.current || rating !== prevRating.current) {
      if (isSeen) {
        setPlay(true);
      }
    }
    prevSeen.current = isSeen;
    prevRating.current = rating;
  }, [isSeen, rating]);

  return (
    <View className="h-6 w-6 items-center justify-center">
      {!isSeen ? (
        <Animated.View
          key="eye"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="absolute"
        >
          <Icon i={Eye} />
        </Animated.View>
      ) : (
        <Animated.View
          key={rating ? `rating-${rating}` : "skip"}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          className="absolute"
        >
          <RatingLottie rating={rating ?? "skip"} play={play} />
        </Animated.View>
      )}
    </View>
  );
};
