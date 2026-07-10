// Wire types for GET /taste/journey — the one-shot bootstrap payload the
// wizard steps render from. Mirrors the backend's taste constants.

export type GenreId = number;

export type Title = {
  title: string;
  year: number;
  genreIds: GenreId[];
  hiddenGem: boolean;
  tmdbId: number;
  poster: string | null;
};

export type GenreChip = {
  id: GenreId;
  example: string;
};

// Answer values for the four taste questions, mirroring the backend's
// ERA / REALITY / TASTE_AUTHORITY / COMMITMENT constants in
// src/taste/constants/journey.constant.ts. Kept in sync by hand — the two
// apps don't share a package.
export const BOTH = "both" as const;

export const ERA = {
  CLASSIC: "classic",
  NEW_RELEASES: "new-release",
  BOTH,
} as const;

export const REALITY = {
  REALISTIC: "realistic",
  FANTASY: "fantasy",
  BOTH,
} as const;

export const TASTE_AUTHORITY = {
  POPULAR: "popular",
  CRITICS_CHOICE: "critics-choice",
  BOTH,
} as const;

export const COMMITMENT = {
  SHORT: "short",
  LONG: "long",
  BOTH,
} as const;

export type EraAnswer = (typeof ERA)[keyof typeof ERA];
export type RealityAnswer = (typeof REALITY)[keyof typeof REALITY];
export type AuthorityAnswer =
  (typeof TASTE_AUTHORITY)[keyof typeof TASTE_AUTHORITY];
export type CommitmentAnswer = (typeof COMMITMENT)[keyof typeof COMMITMENT];

export type AnswerValue =
  EraAnswer | RealityAnswer | AuthorityAnswer | CommitmentAnswer;

export type TasteOption = {
  label: string;
  description?: string;
  value: AnswerValue;
};

export type TasteAxis = "era" | "reality" | "tasteAuthority" | "commitment";

export type TasteQuestion = {
  id: TasteAxis;
  axis: string;
  prompt: string;
  sideA: TasteOption;
  sideB: TasteOption;
  both: TasteOption;
};

export type JourneyResDto = {
  movies: Title[];
  series: Title[];
  genreChips: GenreChip[];
  questions: TasteQuestion[];
  avoidChips: string[];
  exploreLevels: string[];
  rarityWeights: Record<GenreId, number>;
  autoSelectThreshold: number;
};
