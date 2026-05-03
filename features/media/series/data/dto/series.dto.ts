import { RatingEntry } from "@/features/common/data/models/ratings";
import { PosterProps } from "@/features/common/data/models/poster";
import { CreditInfo } from "@/features/common/data/models/credit";
import { Genre } from "@/features/general/data/constants/useGenres";
import { PaginatedResponse } from "@/features/common/data/paginated-response";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { WatchProviders } from "@/features/common/data/models/watch-provider";

export type SeriesInfoResDto = {
  title: string;
  airingYears: string;
  seasonsText: string;
  contentRating: string;
  trailerKey: string;
  posterPath: string;
  overview: string;
  genres: Genre[];
  posterProps: PosterProps;
  credits: SeriesCredits;
  ratings: RatingEntry[];
  watchProviders: WatchProviders;
  recommendations: PosterResDto;
};

export type InterestingSeriesIdsResDto = PaginatedResponse<number>;

export type SeriesCredits = {
  casts: CreditInfo[];
  crew: CreditInfo[];
  creator: CreditInfo;
};
