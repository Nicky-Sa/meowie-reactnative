import { Option } from "@/features/common/option";

// Wire types for GET /taste/journey — the one-shot bootstrap payload the
// journey steps render from. Mirrors the backend's taste constants.

export type Title = {
  title: string;
  year: number;
  genreIds: number[];
  tmdbId: number;
  poster: string | null;
};

export type TasteAxis = "era" | "reality" | "authority" | "commitment";

export type TasteQuestion = {
  id: TasteAxis;
  axis: string;
  prompt: string;
  sideA: Option;
  sideB: Option;
  both: Option;
};

export type JourneyResDto = {
  movies: Title[];
  series: Title[];
  genreIds: number[];
  questions: TasteQuestion[];
  avoidChips: Option[];
  exploreLevels: string[];
};
