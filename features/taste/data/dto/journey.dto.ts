import { Option } from "@/features/common/option";

// Wire types for GET /taste/journey — the one-shot bootstrap payload the
// journey steps render from. Mirrors the backend's taste constants.

export type Title = {
  title: string;
  year: number;
  tmdbId: number;
  poster: string;
};

export type JourneyResDto = {
  movies: Title[];
  series: Title[];
  avoidChips: Option[];
  minMoviesToLike: number;
};
