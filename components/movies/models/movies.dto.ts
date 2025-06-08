import { TMDB_RequiredInfo } from "@/components/movies/models/tmdb/info";
import { AllRatings } from "@/components/movies/models/ratings";
import { PosterProps } from "@/components/movies/models/image";
import { TMDB_MoviesList } from "@/components/movies/models/tmdb/moviesList";

export type MoviesDTO = TMDB_RequiredInfo &
  AllRatings & {
    posterProps: PosterProps;
  };

export type MovieIdsDTO = TMDB_MoviesList;
