export const RATING_SOURCES = [
  "IMDb",
  "Rotten Tomatoes",
  "Metacritic",
  "TMDB",
] as const;

export type Rating_Source = (typeof RATING_SOURCES)[number];

export type RatingEntry = {
  source: Rating_Source;
  value: string;
};
