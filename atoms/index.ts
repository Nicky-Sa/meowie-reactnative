import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { tailwind } from "@/lib/tailwind";
import {
  Filters,
  initialFiltersValue,
} from "@/features/common/data/media-query";
import { atomPersisted } from "@/atoms/storage";
import { MediaType } from "@/features/common/data/models/media-type";

// Color based on the movie poster
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

export const filtersMediaTypeAtom = atom<MediaType>("movie");

export const movieFiltersAtom = atomWithImmer<Filters>(initialFiltersValue);
export const tvFiltersAtom = atomWithImmer<Filters>(initialFiltersValue);

export const filtersAtom = atom(
  (get) => {
    const mediaType = get(filtersMediaTypeAtom);
    return mediaType === "movie" ? get(movieFiltersAtom) : get(tvFiltersAtom);
  },
  (get, set, arg: Filters | ((draft: Filters) => void)) => {
    const mediaType = get(filtersMediaTypeAtom);
    const target = mediaType === "movie" ? movieFiltersAtom : tvFiltersAtom;
    set(target, arg);
  },
);

// It's allowed to play YT videos -> e.g. if a modal wants to pause the trailer
export const allowYTPlayingAtom = atom(true);

// Autoplay trailer
export const autoplayAtom = atomPersisted("autoplay", true);

export const currentRoleInMediaAtom = atom<string>();
export const homeTourSeenAtom = atomPersisted("home-tour-seen", false);
export const swipeGuideSeenAtom = atomPersisted("swipe-guide-seen", false);
