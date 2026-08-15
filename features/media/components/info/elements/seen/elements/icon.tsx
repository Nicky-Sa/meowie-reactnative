import { Eye } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { RatingLottie } from "@/features/media/components/info/elements/seen/elements/rating-lottie";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

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
        <View className="absolute">
          <Icon i={Eye} />
        </View>
      ) : (
        <View key={`rating-${rating ?? "skip"}`} className="absolute">
          <RatingLottie rating={rating ?? null} play={play} />
        </View>
      )}
    </View>
  );
};
