import { MoviePosterInfo } from "@/features/movies/models/movie-info";

export type MoviePosterResDto = {
  page: number;
  results: MoviePosterInfo[];
  total_pages: number;
  total_results: number;
};
