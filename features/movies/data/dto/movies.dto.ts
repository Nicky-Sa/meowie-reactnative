import { AllRatings } from "@/features/movies/models/ratings";
import { PosterProps } from "@/features/movies/models/image";
import {
  Credits,
  TMDB_MoviesListResult,
  TMDB_RequiredInfo,
} from "@/features/movies/models/movie-info";

export type MoviesResDTO = TMDB_RequiredInfo &
  AllRatings & {
    posterProps: PosterProps;
  } & {
    credits: Credits;
  };

export type MovieIdsResDTO = {
  page: number;
  results: TMDB_MoviesListResult[];
  total_pages: number;
  total_results: number;
};
