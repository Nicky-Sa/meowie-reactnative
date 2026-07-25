import { SaveTasteReqDto } from "@/features/taste/data/dto/taste.dto";

/**
 * In-memory state for the taste journey, written to the backend on the reveal
 * step. It is the save body plus how much of each poster pool is on screen.
 */
export type TasteJourneyState = SaveTasteReqDto & {
  moviesShown: number;
  seriesShown: number;
};

export const SHOW_MORE_COUNT = 12;
export const INITIAL_SHOWN = 12;

export const DEFAULT_EXPLORE_LEVEL = 2;

// Every question is answered before the journey can reach the reveal, so these
// only stand in while the user is still working through them.
const NO_PREFERENCE = "both";

export const initialTasteJourneyState = (): TasteJourneyState => ({
  movieIds: [],
  seriesIds: [],
  seriesSkipped: false,
  genreIds: [],
  era: NO_PREFERENCE,
  reality: NO_PREFERENCE,
  authority: NO_PREFERENCE,
  commitment: NO_PREFERENCE,
  avoid: [],
  exploreLevel: DEFAULT_EXPLORE_LEVEL,
  moviesShown: INITIAL_SHOWN,
  seriesShown: INITIAL_SHOWN,
});
