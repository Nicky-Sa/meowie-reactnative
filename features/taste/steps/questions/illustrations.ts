import { SvgImage } from "@/features/common/ui/icon";
import Classic from "@/assets/images/taste/questions/1-era/classic.svg";
import NewRelease from "@/assets/images/taste/questions/1-era/new-release.svg";
import Popular from "@/assets/images/taste/questions/2-authority/popular.svg";
import CriticsChoice from "@/assets/images/taste/questions/2-authority/critics-choice.svg";
import SleepingMeowie from "@/assets/images/taste/questions/both.svg";

// Keyed by the option's wire value from the journey payload, so the illustrations
// stay attached even if labels or question order change.
export const QUESTION_ILLUSTRATIONS: Record<string, SvgImage> = {
  classic: Classic,
  "new-release": NewRelease,
  popular: Popular,
  "critics-choice": CriticsChoice,
  both: SleepingMeowie,
};
