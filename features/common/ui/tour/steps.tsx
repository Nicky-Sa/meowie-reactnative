import type { TourStep as SpotlightStep } from "react-native-spotlight-tour";
import { TourTooltip } from "@/features/common/ui/tour/tooltip";
import { TabsName } from "@/features/general/navbar/types";

// Step order for the home tour. The values are the indexes into `homeTourSteps`
// and the index each Tourable attaches to.
export enum TourStep {
  HeaderToggle = 0,
  DeepDiving = 1,
  SearchExplore = 2,
}

type StepContent = {
  text: string;
  // Points added to the highlight's width and height, half on each side.
  padding: number;
};

export const tourStepContent: Record<TourStep, StepContent> = {
  [TourStep.HeaderToggle]: {
    text: "Switch between Movies and Series to choose what you want to discover.",
    padding: 8,
  },
  [TourStep.DeepDiving]: {
    text: "Tap different elements to see or discover more.",
    padding: 8,
  },
  [TourStep.SearchExplore]: {
    text: "Search for any title or person, or explore top lists and new releases.",
    padding: 24,
  },
};

// The tab each tour step highlights.
export const tabTourSteps: Partial<Record<TabsName, TourStep>> = {
  explore: TourStep.SearchExplore,
};

// Object.values gives number keys in rising order, so the steps come out in
// TourStep's order.
const stepContents = Object.values(tourStepContent);

export const homeTourSteps: SpotlightStep[] = stepContents.map(
  ({ text, padding }) => ({
    shape: { type: "rectangle", padding },
    render: (props) => (
      <TourTooltip {...props} text={text} total={stepContents.length} />
    ),
  }),
);
