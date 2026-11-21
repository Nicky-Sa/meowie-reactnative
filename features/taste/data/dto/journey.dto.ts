import { MediaType } from "@/features/common/data/models/media-type";

// Wire types for GET /taste/journey: the mixed grid of titles to pick from.

export type PickTitle = {
  title: string;
  year: number;
  tmdbId: number;
  poster: string;
  mediaType: MediaType;
};

export type JourneyResDto = {
  titles: PickTitle[];
  minPicks: number;
};
