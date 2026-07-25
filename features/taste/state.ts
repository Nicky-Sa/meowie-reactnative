import { SaveTasteReqDto } from "@/features/taste/data/dto/taste.dto";

/**
 * In-memory state for the taste journey, written to the backend on the reveal
 * step. It is the save body plus how much of each poster pool is on screen and
 * which genres the user added themselves.
 */
export type TasteJourneyState = SaveTasteReqDto & {
  moviesShown: number;
  seriesShown: number;
  // Kept apart from genreIds so the genres a title locked can be dropped again
  // when that title is unpicked, without losing the ones the user tapped.
  addedGenreIds: number[];
};

export const SHOW_MORE_COUNT = 12;
export const INITIAL_SHOWN = 12;

export const DEFAULT_EXPLORE_LEVEL = 2;

// "Not answered yet" must not equal any option id — "both" is the real id of
// "no preference" and would show it preselected. The flow only reaches the
// reveal through the questions, so the blanks never get saved.
const UNANSWERED = "";

export const initialTasteJourneyState = (): TasteJourneyState => ({
  movieIds: [],
  seriesIds: [],
  seriesSkipped: false,
  genreIds: [],
  era: UNANSWERED,
  reality: UNANSWERED,
  authority: UNANSWERED,
  commitment: UNANSWERED,
  avoid: [],
  exploreLevel: DEFAULT_EXPLORE_LEVEL,
  moviesShown: INITIAL_SHOWN,
  seriesShown: INITIAL_SHOWN,
  addedGenreIds: [],
});
