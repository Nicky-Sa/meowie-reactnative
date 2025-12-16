import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { tailwind } from "@/lib/tailwind";

// It's allowed to play YT videos
export const allowYTPlayingAtom = atom(true);

// Color based on the movie poster
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

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

export const filtersAtom = atomWithImmer<Filters>(initialFiltersValue);

// Sort
export type Sort = "popularity.desc" | "primary_release_date.desc" | "random";
export const InitialSort: Sort = "popularity.desc";
export const sortAtom = atom<Sort>(InitialSort);
