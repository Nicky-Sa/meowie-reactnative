export type Browse = {
  personId: string;
};

export type ID = number | string;

export type SearchParams = SeriesFilters & MovieFilters & Browse;

// Movie
export type MovieFilters = {
  genres: string[];
  languages: string[];
  decade: string;
  tmdbRatings: string[];
};

export const initialMovieFiltersValue: MovieFilters = {
  genres: [],
  languages: [],
  decade: "any",
  tmdbRatings: ["0", "10"],
};

// Series
export type SeriesFilters = {
  genres: string[];
  format: string;
  languages: string[];
  decade: string;
  tmdbRatings: string[];
};

export const initialSeriesFiltersValue: SeriesFilters = {
  genres: [],
  format: "any",
  languages: [],
  decade: "any",
  tmdbRatings: ["0", "10"],
};
