import { Option } from "@/features/common/option";

// Wire types for GET /taste/journey — the one-shot bootstrap payload the
// journey steps render from. Mirrors the backend's taste constants.

export type Title = {
  title: string;
  year: number;
  tmdbId: number;
  poster: string;
};

export type TasteAxis = "era" | "authority";

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
  questions: TasteQuestion[];
  avoidChips: Option[];
  exploreLevels: string[];
};
