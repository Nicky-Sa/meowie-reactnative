import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { tailwind } from "@/lib/tailwind";
import { Filters, initialFiltersValue } from "@/features/common/data/query";

// It's allowed to play YT videos
export const allowYTPlayingAtom = atom(true);

// Color based on the movie poster
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

export const filtersAtom = atomWithImmer<Filters>(initialFiltersValue);
