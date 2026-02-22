import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { tailwind } from "@/lib/tailwind";
import {
  Filters,
  ID,
  initialFiltersValue,
} from "@/features/common/data/media-query";
import { atomPersisted } from "@/atoms/storage";

// Color based on the movie poster
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

export const filtersAtom = atomWithImmer<Filters>(initialFiltersValue);

// It's allowed to play YT videos -> e.g. if a modal wants to pause the trailer
export const allowYTPlayingAtom = atom(true);

// Autoplay trailer
export const autoplayAtom = atomPersisted("autoplay", true);

export const currentMovieIdAtom = atom<ID>();
export const currentTvIdAtom = atom<ID>();
