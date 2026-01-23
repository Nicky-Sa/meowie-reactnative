import { RatingEntry } from "@/features/movies/models/ratings";
import { PosterProps } from "@/features/movies/models/image";
import { Credits } from "@/features/movies/models/movie-info";
import { Genre } from "@/features/general/data/constants/useGenres";

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
  credits: Credits;
  ratings: RatingEntry[];
};
