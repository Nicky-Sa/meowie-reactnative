// Filters
export type Filters = {
  genres: string[];
  languages: string[];
  decade: string;
  tmdbRatings: number[];
};

export const initialFiltersValue: Filters = {
  genres: [],
  languages: [],
  decade: "",
  tmdbRatings: [0, 10],
};

export type ID = number | string;

// Sort
export type Sort = "popularity.desc" | "primary_release_date.desc" | "random";
export const InitialSort: Sort = "popularity.desc";

// Search params = filters, browse, etc. Since sort's persisted, it will not be in searchParams

export type Browse =
  | {
      genres: string[];
    }
  | {
      personId: string;
    };

export type SearchParams = Filters & Browse;
