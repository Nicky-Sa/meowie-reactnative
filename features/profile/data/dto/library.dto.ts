import { LibraryCategory } from "@/features/profile/data/library.constants";
import { MediaType } from "@/features/common/data/models/media-type";

type LibraryItemIdentifier = {
  tmdbId: number;
  mediaType: MediaType;
};

export type MarkSavedReqDto = LibraryItemIdentifier;

export type RemoveItemReqDto = LibraryItemIdentifier;

export type MarkSeenReqDto = LibraryItemIdentifier & {
  rating?: number;
};

export type UpdateRatingReqDto = LibraryItemIdentifier & {
  rating?: number;
};

export type LibraryStatusResDto = Partial<Record<LibraryCategory, boolean>> & {
  rating?: number | null;
};
