import { AllRatings } from "@/features/movies/movies-info/models/ratings";
import { PosterProps } from "@/features/movies/movies-info/models/image";
import {
  Credits,
  MovieDetails,
} from "@/features/movies/movies-info/models/movie-info";

export type MovieInfoResDto = MovieDetails &
  AllRatings & {
    posterProps: PosterProps;
  } & {
    credits: Credits;
  };
