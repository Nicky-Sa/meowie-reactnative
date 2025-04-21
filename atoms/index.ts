import { tailwind } from "@/lib/utils";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

// A YT video playing
export const isYTPlayingAtom = atom(true);

// Color based on the movie poster
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

// Filters
export type Filters = {
  genres: string[];
  languages: string[];
  decades: string[];
  tmdbRatings: number[];
};

export const initialFiltersValue: Filters = {
  genres: [],
  languages: [],
  decades: [],
  tmdbRatings: [0, 10],
};

export const filtersAtom = atomWithImmer<Filters>(initialFiltersValue);

