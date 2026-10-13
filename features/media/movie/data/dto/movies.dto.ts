import { RatingEntry } from "@/features/common/data/models/ratings";
import { PosterProps } from "@/features/common/data/models/poster";
import { CreditInfo } from "@/features/common/data/models/credit";
import { Genre } from "@/features/general/data/constants/use-genres";
import { WatchProviders } from "@/features/common/data/models/watch-provider";

export type MovieDetailsResDto = {
  title: string;
  screeningStatus: string;
  duration: string;
  certification: string;
  trailerKey: string;
  posterPath: string;
  overview: string;
  genres: Genre[];
  posterProps: PosterProps;
  backdropPath?: string;
  credits: MovieCredits;
  ratings: RatingEntry[];
  watchProviders: WatchProviders;
  ticketLink?: string;
};

export type MovieCredits = {
  casts: CreditInfo[];
  crew: CreditInfo[];
  director: CreditInfo;
};
