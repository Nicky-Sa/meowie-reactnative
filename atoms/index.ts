import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { tailwind } from "@/lib/tailwind";
import {
  MovieFilters,
  initialMovieFiltersValue,
  SeriesFilters,
  initialSeriesFiltersValue,
} from "@/features/common/data/media-query";
import { atomPersisted } from "@/atoms/storage";
import { MediaType } from "@/features/common/data/models/media-type";
import { PERSISTED_ATOM_KEYS } from "@/features/common/data/utils/storage-keys";
import {
  initialTasteOnboardingState,
  TasteOnboardingState,
} from "@/features/taste/state";

// Color based on the movie poster
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

export const filtersMediaTypeAtom = atom<MediaType>("movie");

export const movieFiltersAtom = atomWithImmer<MovieFilters>(
  initialMovieFiltersValue,
);
export const tvFiltersAtom = atomWithImmer<SeriesFilters>(
  initialSeriesFiltersValue,
);

// It's allowed to play YT videos -> e.g. if a modal wants to pause the trailer
export const allowYTPlayingAtom = atom(true);

// Autoplay trailer
export const autoplayAtom = atomPersisted(PERSISTED_ATOM_KEYS.AUTOPLAY, true);

// Trailer volume
export const ytMutedAtom = atom(true);

export const currentRoleInMediaAtom = atom<string>();

// Tour and onboarding
export const homeTourSeenAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.HOME_TOUR_SEEN,
  false,
);
export const swipeGuideSeenAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.SWIPE_GUIDE_SEEN,
  false,
);

// Location and Country (persisted)
export const countryCodeAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.COUNTRY_CODE,
  "US",
);

// Release notes — ISO createdAt of the newest note the user has opened.
// Empty means none seen yet, so any note shows the "new" badge.
export const lastSeenReleaseNoteAtAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.LAST_SEEN_RELEASE_NOTE_AT,
  "",
);

export const tasteOnboardingAtom = atomWithImmer<TasteOnboardingState>(
  initialTasteOnboardingState(),
);
