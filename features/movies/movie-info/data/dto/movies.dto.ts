import { AllRatings } from "@/features/movies/movie-info/models/ratings";
import { PosterProps } from "@/features/movies/movie-info/models/image";
import {
  Credits,
  MovieDetails,
} from "@/features/movies/movie-info/models/movie-info";

export type MovieInfoResDto = MovieDetails &
  AllRatings & {
    posterProps: PosterProps;
  } & {
    credits: Credits;
  };
