import { Eye } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { RatingLottie } from "@/features/media/components/details/elements/seen/rating-lottie";
import { useEffect, useRef, useState } from "react";

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

  if (!isSeen) {
    return <Icon i={Eye} />;
  }

  if (rating) {
    return <RatingLottie rating={rating} play={play} />;
  }

  // Seen but no rating (skipped)
  return <RatingLottie rating={"skip"} play={play} />;
};
