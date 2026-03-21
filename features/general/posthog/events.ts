import { Filters, ID } from "@/features/common/data/media-query";
import { MediaType } from "lightningcss";

export type SORT_OPENED = {
  event: "sort_opened";
  properties?: undefined;
};
export type SORT_APPLIED = {
  event: "sort_applied";
  properties: {
    sort_type: string;
  };
};

export type TRAILER_PLAYED = {
  event: "trailer_played";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
    autoplay: boolean;
  };
};

export type TRAILER_PAUSED = {
  event: "trailer_paused";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
  };
};

export type MEDIA_SAVED = {
  event: "media_saved";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
    genres: string[];
    saved: boolean | null; // null for guest
  };
};

export type POSTER_EXPANDED = {
  event: "poster_expanded";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
  };
};

export type PERSON_CLICKED = {
  event: "person_clicked";
  properties: {
    person_id: ID;
    person_name: string;
    role: "director" | "cast" | "creator";
  };
};

export type GENRE_CLICKED = {
  event: "genre_clicked";
  properties: {
    genre_id: ID;
    genre_name: string;
    media_type: MediaType;
  };
};

export type POSTER_CLICKED = {
  event: "poster_clicked";
  properties: {
    media_type: MediaType;
    media_id: ID;
  };
};

export type NAVIGATION_CLICKED = {
  event: "navigation_clicked";
  properties: {
    destination: string;
  };
};

export type SEARCH_SUBMITTED = {
  event: "search_submitted";
  properties: {
    query: string;
  };
};

export type FILTERS_OPENED = {
  event: "filters_opened";
  properties: undefined;
};

export type FILTERS_APPLIED = {
  event: "filters_applied";
  properties: {
    filters: Filters;
    mediaType: string;
  };
};

export type PROFILE_TAB_CHANGED = {
  event: "profile_tab_changed";
  properties: {
    tab_name: string;
  };
};

export type AUTOPLAY_TOGGLED = {
  event: "autoplay_toggled";
  properties: {
    autoplay: boolean;
  };
};

export type CACHE_CLEARED = {
  event: "cache_cleared";
  properties: undefined;
};

export type AUTH_SKIPPED = {
  event: "auth_skipped";
  properties: undefined;
};

export type Events =
  | SORT_OPENED
  | SORT_APPLIED
  | TRAILER_PAUSED
  | TRAILER_PLAYED
  | MEDIA_SAVED
  | POSTER_EXPANDED
  | PERSON_CLICKED
  | GENRE_CLICKED
  | POSTER_CLICKED
  | NAVIGATION_CLICKED
  | SEARCH_SUBMITTED
  | FILTERS_OPENED
  | FILTERS_APPLIED
  | PROFILE_TAB_CHANGED
  | AUTOPLAY_TOGGLED
  | CACHE_CLEARED
  | AUTH_SKIPPED;

export type Event = Events["event"];
export type Properties<E extends Event> = Extract<
  Events,
  { event: E }
>["properties"];
