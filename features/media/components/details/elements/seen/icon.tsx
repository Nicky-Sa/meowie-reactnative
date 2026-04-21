import { Eye } from "iconoir-react-native";
import RatingSkip from "@/assets/images/ratings/rating-skip.svg";
import { Icon } from "@/features/common/ui/icon";
import { RATINGS } from "@/features/media/components/details/elements/seen/rating-icons";

type Props = {
  isSeen: boolean;
  rating: number | null | undefined;
};

export const SeenIcon = ({ isSeen, rating }: Props) => {
  if (!isSeen) {
    return <Icon i={Eye} />;
  }

  if (rating) {
    const icon = RATINGS.find((r) => r.value === rating)?.icon;
    if (icon) return <Icon i={icon} />;
  }

  // Seen but no rating (skipped)
  return <Icon i={RatingSkip} />;
};
