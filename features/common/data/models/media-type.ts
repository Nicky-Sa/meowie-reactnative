export type MediaType = "movie" | "series";

export const MEDIA_TYPES = [
  { label: "Movie", value: "movie" as const },
  { label: "Series", value: "series" as const },
];

export const MEDIA_TYPES_PLURALS: Record<MediaType, string> = {
  movie: "movies",
  series: "series",
};
