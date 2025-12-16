import { MoviePosterInfo } from "@/features/movies/movie-info/models/movie-info";

export type MoviePosterResDto = {
  page: number;
  results: MoviePosterInfo[];
  total_pages: number;
  total_results: number;
};
