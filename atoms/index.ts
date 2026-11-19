import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { tailwind } from "@/lib/tailwind";
import {
  MovieFilters,
  initialMovieFiltersValue,
  SeriesFilters,
  initialSeriesFiltersValue,
} from "@/features/common/data/media-query";
import { atomPersisted, atomPersistedWithImmer } from "@/atoms/storage";
import { MediaType } from "@/features/common/data/models/media-type";
import { PERSISTED_ATOM_KEYS } from "@/features/common/data/utils/storage-keys";
import { initialTasteState, TasteState } from "@/features/taste/state";
import { Href } from "expo-router";

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

// Autoplay trailer: on at every app start. Not saved, so a pause lasts only until the app closes.
export const autoplayAtom = atom(true);

// Trailer volume
export const ytMutedAtom = atom(true);

export const currentRoleInMediaAtom = atom<string>();

// Tour and onboarding
export const homeTourSeenAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.HOME_TOUR_SEEN,
  false,
);
export const scrollHintSeenAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.SCROLL_HINT_SEEN,
  false,
);
export const feedFirstScrollTrackedAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.FEED_FIRST_SCROLL_TRACKED,
  false,
);
// Not saved: after a restart, the first scroll is sent without its seconds since the tour.
export const tourEndedAtAtom = atom<number | null>(null);

// App Store review prompt — ISO time Meowie last asked. Empty means never.
export const reviewAskedAtAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.REVIEW_ASKED_AT,
  "",
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

// The App Store version the person tapped "Later" on, so its popup doesn't show again.
export const skippedUpdateVersionAtom = atomPersisted(
  PERSISTED_ATOM_KEYS.SKIPPED_UPDATE_VERSION,
  "",
);

export const tasteAtom = atomPersistedWithImmer<TasteState>(
  PERSISTED_ATOM_KEYS.TASTE,
  initialTasteState(),
  true,
);

// A link or Siri request that started the app. It opens once the app has loaded Home.
export const linkToOpenAtom = atom<Href | null>(null);
