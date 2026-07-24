import type { TourStep as SpotlightStep } from "react-native-spotlight-tour";
import { TourTooltip } from "./tooltip";

// Step order for the home tour. The values are the indexes into `homeTourSteps`
// and the index each Tourable attaches to.
export enum TourStep {
  HeaderToggle = 0,
  MediaPoster = 1,
  MediaDirector = 2,
  MediaGenres = 3,
  MediaSave = 4,
  MediaSeen = 5,
  MediaDetails = 6,
}

export const tourStepContent: Record<TourStep, string> = {
  [TourStep.HeaderToggle]:
    "Switch between Movies and Series to explore different content types.",
  [TourStep.MediaPoster]:
    "Tap on the poster to view a high-quality version and more info.",
  [TourStep.MediaDirector]:
    "Check out the director and key crew members of this movie.",
  [TourStep.MediaGenres]:
    "Explore different genres associated with this media.",
  [TourStep.MediaSave]:
    "Save this item to your library to keep track of what you want to watch.",
  [TourStep.MediaSeen]:
    "Mark this as seen once you've watched it to organize your library.",
  [TourStep.MediaDetails]: "See more details on this item here.",
};

const TOTAL_STEPS = Object.keys(tourStepContent).length;

// The steps in the order the tour walks through them. The array index is the
// value each Tourable attaches to (see TourStep), so this order is the source
// of truth for both the sequence and which element each step highlights.
const stepOrder: TourStep[] = [
  TourStep.HeaderToggle,
  TourStep.MediaPoster,
  TourStep.MediaDirector,
  TourStep.MediaGenres,
  TourStep.MediaSave,
  TourStep.MediaSeen,
  TourStep.MediaDetails,
];

export const homeTourSteps: SpotlightStep[] = stepOrder.map((step) => ({
  shape: { type: "rectangle", padding: 8 },
  render: (props) => (
    <TourTooltip {...props} text={tourStepContent[step]} total={TOTAL_STEPS} />
  ),
}));
