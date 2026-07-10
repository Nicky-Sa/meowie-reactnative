import { GenreId } from "@/features/taste/data/dto/journey.dto";

/**
 * In-memory state for the taste journey. Held for the duration of the flow,
 * reset by "Start over", and written to the backend (PUT /taste) on the reveal
 * step. Selections are keyed by TMDB id.
 */
export type TasteAnswers = {
  era?: string;
  reality?: string;
  tasteAuthority?: string;
  commitment?: string;
};

export type TasteOnboardingState = {
  moviesSelected: number[];
  seriesSelected: number[];
  seriesSkipped: boolean;
  genresConfirmed: GenreId[];
  // True once the user manually toggles a genre chip, so returning to step 3
  // preserves their edits instead of re-running auto-select.
  genresTouched: boolean;
  taste: TasteAnswers;
  avoid: string[];
  exploreLevel: number;
  moviesShown: number;
  seriesShown: number;
};

export const PAGE_SIZE = 12;
export const INITIAL_SHOWN = 12;

export const DEFAULT_EXPLORE_LEVEL = 2;

export const initialTasteOnboardingState = (): TasteOnboardingState => ({
  moviesSelected: [],
  seriesSelected: [],
  seriesSkipped: false,
  genresConfirmed: [],
  genresTouched: false,
  taste: {},
  avoid: [],
  exploreLevel: DEFAULT_EXPLORE_LEVEL,
  moviesShown: INITIAL_SHOWN,
  seriesShown: INITIAL_SHOWN,
});
