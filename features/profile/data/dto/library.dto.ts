import {
  LibraryCategory,
  LibraryMediaType,
} from "@/features/profile/data/library.constants";

export type ToggleLibraryItemReqDto = {
  tmdbId: number;
  mediaType: LibraryMediaType;
  category: LibraryCategory;
};

export type LibraryStatusResDto = Partial<Record<LibraryCategory, boolean>>;
