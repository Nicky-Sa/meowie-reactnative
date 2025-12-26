import { AllRatings } from "@/features/movies/models/ratings";
import { PosterProps } from "@/features/movies/models/image";
import { Credits, MovieDetails } from "@/features/movies/models/movie-info";

export type MovieInfoResDto = MovieDetails &
  AllRatings & {
    posterProps: PosterProps;
  } & {
    credits: Credits;
  };
