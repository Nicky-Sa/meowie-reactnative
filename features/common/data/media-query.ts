export type Page = {
  page?: number;
};

export enum SortOption {
  POPULARITY = "popularity",
  NEWEST = "newest",
  RANDOM = "random",
}

export type Sort = {
  sort?: SortOption;
};

export type Browse = {
  personId: string;
};

export type Filters = {
  genres: string[];
  languages: string[];
  decade: string;
  tmdbRatings: string[];
};

export const initialFiltersValue: Filters = {
  genres: [],
  languages: [],
  decade: "",
  tmdbRatings: ["0", "10"],
};

export type ID = number | string;

export type SearchParams = Filters & Browse;
