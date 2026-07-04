/**
 * Central registry of every local-storage identifier the app uses.
 * Reference these instead of raw strings so keys are discoverable, renamable
 * in one place, and reusable (e.g. for logout/delete eviction).
 *
 * NOTE: the string VALUES are the on-device keys — changing a value orphans
 * any data already stored under the old key. Only rename the constant, not
 * the string, unless you intend to drop existing data.
 */

/** MMKV instance ids (one isolated store per id). */
export const STORAGE_IDS = {
  PERSISTED_ATOMS: "persisted-atoms",
  APP_STORAGE: "app-storage",
  POSTHOG: "posthog-storage",
} as const;

/** Keys in the secure store (expo-secure-store) — sensitive auth tokens. */
export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: "access-token",
  REFRESH_TOKEN: "refresh-token",
} as const;

/** Keys in the general-purpose appStorage MMKV store. */
export const APP_STORAGE_KEYS = {
  ONBOARDED: "onboarded",
} as const;

export type AppStorageKey =
  (typeof APP_STORAGE_KEYS)[keyof typeof APP_STORAGE_KEYS];

/** Keys for persisted Jotai atoms (the "persisted-atoms" MMKV store). */
export const PERSISTED_ATOM_KEYS = {
  AUTOPLAY: "autoplay",
  SORT: "sort",
  HOME_TOUR_SEEN: "home-tour-seen",
  SWIPE_GUIDE_SEEN: "swipe-guide-seen",
  COUNTRY_CODE: "country-code",
  RECENT_SEARCHES: "recent-searches",
  LAST_SEEN_RELEASE_NOTE_AT: "last-seen-release-note-at",
} as const;
