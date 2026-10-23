export type MediaType = "movie" | "series";

export const MEDIA_TYPES = [
  { label: "Movie", value: "movie" as const },
  { label: "Series", value: "series" as const },
];

export const isMediaType = (value: unknown): value is MediaType =>
  MEDIA_TYPES.some((mediaType) => mediaType.value === value);

export const MEDIA_TYPES_PLURALS: Record<MediaType, string> = {
  movie: "movies",
  series: "series",
};
