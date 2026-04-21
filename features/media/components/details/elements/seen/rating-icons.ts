import Rating1 from "@/assets/images/ratings/rating-1.svg";
import Rating2 from "@/assets/images/ratings/rating-2.svg";
import Rating3 from "@/assets/images/ratings/rating-3.svg";
import Rating4 from "@/assets/images/ratings/rating-4.svg";
import Rating5 from "@/assets/images/ratings/rating-5.svg";
import { SvgImage } from "@/features/common/ui/icon";

export const RATINGS: { value: number; icon: SvgImage }[] = [
  { value: 1, icon: Rating1 },
  { value: 2, icon: Rating2 },
  { value: 3, icon: Rating3 },
  { value: 4, icon: Rating4 },
  { value: 5, icon: Rating5 },
] as const;
