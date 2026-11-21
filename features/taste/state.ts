import { MediaType } from "@/features/common/data/models/media-type";
import { TitlePick } from "@/features/taste/data/dto/taste.dto";

export type TasteState = {
  picks: TitlePick[];
  completed: boolean;
};

export const initialTasteState = (): TasteState => ({
  picks: [],
  completed: false,
});

// A movie and a series can share a TMDB id, so a pick is only unique with its type.
export const pickKey = ({ tmdbId, mediaType }: TitlePick) =>
  `${mediaType}:${tmdbId}`;

export const countPicks = (picks: TitlePick[], mediaType: MediaType) =>
  picks.filter((pick) => pick.mediaType === mediaType).length;
