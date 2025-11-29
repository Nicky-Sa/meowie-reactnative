import { AllRatings } from "@/features/movies/movie-info/models/ratings";
import { PosterProps } from "@/features/movies/movie-info/models/image";
import {
  Credits,
  TMDB_RequiredInfo,
} from "@/features/movies/movie-info/models/movie-info";

export type MoviesResDto = TMDB_RequiredInfo &
  AllRatings & {
    posterProps: PosterProps;
  } & {
    credits: Credits;
  };
