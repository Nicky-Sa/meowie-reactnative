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

export type SearchResultSeries = {
  id: number;
  title: string;
  posterPath: string;
  mediaType: "series";
  genres: string[];
  firstAirDate: string;
};

export type SearchResultMovieGenre = Genre & {
  mediaType: "movie-genre";
};

export type SearchResultSeriesGenre = Genre & {
  mediaType: "series-genre";
};

export type MultiSearchResults =
  | SearchResultPerson
  | SearchResultMovie
  | SearchResultSeries
  | SearchResultMovieGenre
  | SearchResultSeriesGenre;
