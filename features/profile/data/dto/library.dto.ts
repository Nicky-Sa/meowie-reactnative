import { LibraryCategory } from "@/features/profile/data/library.constants";

export type RatingReqDto = {
  rating?: number;
};

export type LibraryStatusResDto = Partial<Record<LibraryCategory, boolean>> & {
  rating?: number | null;
};
