import { RatingEntry } from "@/features/common/data/models/ratings";
import { PosterProps } from "@/features/common/data/models/poster";
import { CastInfo } from "@/features/common/data/models/cast";
import { Genre } from "@/features/general/data/constants/useGenres";
import { PaginatedResponse } from "@/features/common/data/paginated-response";

export type MovieInfoResDto = {
  title: string;
  screeningStatus: string | null;
  duration: string;
  certification: string;
  trailerKey: string;
  posterPath: string;
  overview: string;
  genres: Genre[];
  posterProps: PosterProps;
  credits: MovieCredits;
  ratings: RatingEntry[];
};

export type InterestingMovieIdsResDto = PaginatedResponse<number>;

export type MovieCredits = {
  casts: CastInfo[];
  director: CastInfo;
};
