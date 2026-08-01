import {
  SaveTasteReqDto,
  TitleRatings,
} from "@/features/taste/data/dto/taste.dto";

// Held in memory across the steps and sent whole on the reveal step.
export type TasteJourneyState = SaveTasteReqDto;

const DEFAULT_EXPLORE_LEVEL = 2;

// "Not answered yet" must not equal any option id — "both" is the real id of
// "no preference" and would show it preselected.
const UNANSWERED = "";

export const initialTasteJourneyState = (): TasteJourneyState => ({
  movieRatings: {},
  seriesRatings: {},
  era: UNANSWERED,
  authority: UNANSWERED,
  avoid: [],
  exploreLevel: DEFAULT_EXPLORE_LEVEL,
});

// "Haven't seen it" says nothing about their taste, so it doesn't count.
export const countOpinions = (ratings: TitleRatings) =>
  Object.values(ratings).filter((answer) => answer !== "not-seen").length;
