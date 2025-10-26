import { TMDB_RequiredInfo } from "@/features/movies/models/tmdb/info";
import { AllRatings } from "@/features/movies/models/ratings";
import { PosterProps } from "@/features/movies/models/image";
import { TMDB_MoviesListResult } from "@/features/movies/models/tmdb/movies-list";

export type MoviesResDTO = TMDB_RequiredInfo &
  AllRatings & {
    posterProps: PosterProps;
  };

export type MovieIdsResDTO = {
  page: number;
  results: TMDB_MoviesListResult[];
  total_pages: number;
  total_results: number;
};
