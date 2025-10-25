import { TMDB_RequiredInfo } from "@/components/movies/models/tmdb/info";
import { AllRatings } from "@/components/movies/models/ratings";
import { PosterProps } from "@/components/movies/models/image";
import { TMDB_MoviesListResult } from "@/components/movies/models/tmdb/movies-list";

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
