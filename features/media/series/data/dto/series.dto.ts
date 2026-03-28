import { RatingEntry } from "@/features/common/data/models/ratings";
import { PosterProps } from "@/features/common/data/models/poster";
import { CastInfo } from "@/features/common/data/models/cast";
import { Genre } from "@/features/general/data/constants/useGenres";
import { PaginatedResponse } from "@/features/common/data/paginated-response";

export type SeriesCredits = {
  casts: CastInfo[];
  creator: CastInfo;
};

export type SeriesInfoResDto = {
  title: string;
  airingYears: `${string} - ${string}` | "N/A";
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
