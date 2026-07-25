import { SvgImage } from "@/features/common/ui/icon";
import Classic from "@/assets/images/taste/questions/1-era/classic.svg";
import NewRelease from "@/assets/images/taste/questions/1-era/new-release.svg";
import Realistic from "@/assets/images/taste/questions/2-reality/realistic.svg";
import Fantasy from "@/assets/images/taste/questions/2-reality/fantasy.svg";
import Popular from "@/assets/images/taste/questions/3-authority/popular.svg";
import CriticsChoice from "@/assets/images/taste/questions/3-authority/critics-choice.svg";
import Short from "@/assets/images/taste/questions/4-commitment/short.svg";
import Long from "@/assets/images/taste/questions/4-commitment/long.svg";

// Keyed by the option's wire value from the journey payload, so the illustrations
// stay attached even if labels or question order change.
export const QUESTION_ILLUSTRATIONS: Record<string, SvgImage> = {
  classic: Classic,
  "new-release": NewRelease,
  realistic: Realistic,
  fantasy: Fantasy,
  popular: Popular,
  "critics-choice": CriticsChoice,
  short: Short,
  long: Long,
};
