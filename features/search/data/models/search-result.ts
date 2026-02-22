import { Genre } from "@/features/general/data/constants/useGenres";

export type SearchResultPerson = {
  id: number;
  name: string;
  mediaType: "person";
  knownForDepartment: string;
  profilePath: string;
};

export type SearchResultMovie = {
  id: number;
  title: string;
  posterPath: string;
  mediaType: "movie";
  genres: string[];
  releaseYear: string;
};

export type SearchResultMovieGenre = Genre & {
  mediaType: "movie-genre";
};

export type SearchResultTvGenre = Genre & {
  mediaType: "tv-genre";
};

export type MultiSearchResults =
  | SearchResultPerson
  | SearchResultMovie
  | SearchResultMovieGenre
  | SearchResultTvGenre;
