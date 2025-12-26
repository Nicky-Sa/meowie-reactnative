// Filters
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

// Sort
export type Sort = "popularity.desc" | "primary_release_date.desc" | "random";
export const initialSort: Sort = "popularity.desc";

// Browse include items that don't have an individual modifier in the filters page,
// but can still be used to filter results
type Browse = {
  personId: string;
};

// Search params = anything that can be used to filter results.
// Since the sort's persisted, it will not be in SearchParams
export type SearchParams = Filters & Browse;
