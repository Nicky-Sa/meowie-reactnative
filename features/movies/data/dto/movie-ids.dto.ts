import { TMDB_MoviesListResult } from "@/features/movies/movie-info/models/movie-info";

export type MovieIdsResDto = {
  page: number;
  results: TMDB_MoviesListResult[];
  total_pages: number;
  total_results: number;
};
