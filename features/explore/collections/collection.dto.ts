export type CollectionSourceType = "tmdb_endpoint" | "manual" | "group";
export type CollectionMediaType = "movie" | "series" | "mixed";

export type CollectionResDto = {
  id: number;
  slug: string;
  title: string;
  logoUrl: string;
  mediaType: CollectionMediaType;
  sourceType: CollectionSourceType;
  backdropUrl: string;
  colorHex: string;
};
