import { RatingEntry } from "@/features/common/data/models/ratings";
import { PosterProps } from "@/features/common/data/models/poster";
import { CreditInfo } from "@/features/common/data/models/credit";
import { Genre } from "@/features/general/data/constants/useGenres";
import { PaginatedResponse } from "@/features/common/data/paginated-response";

export type SeriesInfoResDto = {
  title: string;
  airingYears: string;
  numberOfSeasons: number;
  contentRating: string;
  trailerKey: string;
  posterPath: string;
  overview: string;
  genres: Genre[];
  posterProps: PosterProps;
  credits: SeriesCredits;
  ratings: RatingEntry[];
};

export type InterestingSeriesIdsResDto = PaginatedResponse<number>;

export type SeriesCredits = {
  casts: CreditInfo[];
  crew: CreditInfo[];
  creator: CreditInfo;
};
