import { LibraryCategory } from "@/features/profile/data/library.constants";
import { MediaType } from "@/features/common/data/models/media-type";

export type ToggleLibraryItemReqDto = {
  tmdbId: number;
  mediaType: MediaType;
  category: LibraryCategory;
};

export type LibraryStatusResDto = Partial<Record<LibraryCategory, boolean>>;
