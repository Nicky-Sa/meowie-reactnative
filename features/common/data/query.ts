// Filters
export type Filters = {
  genres: string[];
  languages: string[];
  decade: string;
  tmdbRatings: number[];
  personId?: number;
};

export const initialFiltersValue: Filters = {
  genres: [],
  languages: [],
  decade: "",
  tmdbRatings: [0, 10],
  personId: undefined,
};

// Sort
export type Sort = "popularity.desc" | "primary_release_date.desc" | "random";
export const InitialSort: Sort = "popularity.desc";

// Search params = filters, etc. Since sort's persisted, it will not be in searchParams
export type SearchParams = Filters;
