import { RatingEntry } from "@/features/common/data/models/ratings";
import { PosterProps } from "@/features/common/data/models/poster";
import { CastInfo } from "@/features/common/data/models/cast";
import { Genre } from "@/features/general/data/constants/useGenres";
import { PaginatedResponse } from "@/features/common/data/paginated-response";

export type TvCredits = {
  casts: CastInfo[];
  creator: CastInfo;
};

export type TvInfoResDto = {
  title: string;
  airingYears: `${string} - ${string}`;
  avgDuration: string;
  contentRating: string;
  trailerKey: string;
  posterPath: string;
  overview: string;
  genres: Genre[];
  posterProps: PosterProps;
  credits: TvCredits;
  ratings: RatingEntry[];
};

export type InterestingTvIdsResDto = PaginatedResponse<number>;
