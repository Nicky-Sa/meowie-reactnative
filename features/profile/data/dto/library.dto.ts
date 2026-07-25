import { LibraryCategory } from "@/features/profile/data/library.constants";

export type RatingReqDto = {
  // null is a skipped rating.
  rating: number | null;
};

export type LibraryStatusResDto = Partial<Record<LibraryCategory, boolean>> & {
  rating: number | null;
};
