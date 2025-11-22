import { tailwind } from "@/lib/utils";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

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
};

export const initialFiltersValue: Filters = {
  genres: [],
  languages: [],
  decade: "",
  tmdbRatings: [0, 10],
};

export const filtersAtom = atomWithImmer<Filters>(initialFiltersValue);

export const filtersQueryParamsAtom = atom("");
