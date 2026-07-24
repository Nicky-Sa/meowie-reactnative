import {
  MovieFilters,
  ID,
  SeriesFilters,
} from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { CollectionSourceType } from "@/features/explore/collections/collection.dto";

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

export type MEDIA_SAVE_CLICKED = {
  event: "media_save_clicked";
  properties: {
    media_id: ID;
    media_type: MediaType;
    media_title: string;
    genres: string[];
  };
};

export type MEDIA_UNSAVE_CLICKED = {
  event: "media_unsave_clicked";
  properties: {
    media_id: ID;
    media_type: MediaType;
    media_title: string;
    genres: string[];
  };
};

export type MEDIA_SEEN_CLICKED = {
  event: "media_seen_clicked";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
    genres: string[];
  };
};

export type MEDIA_UNSEEN_CLICKED = {
  event: "media_unseen_clicked";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
    genres: string[];
  };
};

export type MEDIA_RATED = {
  event: "media_rated";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
    genres: string[];
    rating: number | null;
    is_first_time_rating: boolean;
  };
};

export type MEDIA_RATING_SKIPPED = {
  event: "media_rating_skipped";
  properties: {
    media_type: MediaType;
    media_id: ID;
    media_title: string;
    genres: string[];
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

export type POSTER_LONG_PRESSED = {
  event: "poster_long_pressed";
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
    filters: MovieFilters | SeriesFilters;
    mediaType: string;
  };
};

export type PROFILE_TAB_CHANGED = {
  event: "profile_tab_changed";
  properties: {
    tab_name: string;
  };
};

export type PROFILE_SAVED_TAB_CLICKED = {
  event: "profile_saved_tab_clicked";
  properties?: undefined;
};

export type PROFILE_SEEN_TAB_CLICKED = {
  event: "profile_seen_tab_clicked";
  properties?: undefined;
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

export type COLLECTION_CLICKED = {
  event: "collection_clicked";
  properties: {
    id: number;
    title: string;
    sourceType: CollectionSourceType;
  };
};

export type OTP_REQUESTED = {
  event: "otp_requested";
  properties?: undefined;
};

export type LOGIN_COMPLETED = {
  event: "login_completed";
  properties: {
    is_new_user: boolean;
  };
};

export type LOGOUT = {
  event: "logout";
  properties?: undefined;
};

export type ACCOUNT_DELETED = {
  event: "account_deleted";
  properties: {
    churn_reason_id?: string;
  };
};

export type MEDIA_DETAILS_VIEWED = {
  event: "media_details_viewed";
  properties: {
    media_id: ID;
    media_type: MediaType;
    duration_ms: number;
  };
};
export type WATCH_PROVIDERS_CLICKED = {
  event: "watch_providers_clicked";
  properties: {
    media_id: ID;
    media_type: MediaType;
  };
};

export type RECOMMENDATIONS_SEE_MORE_CLICKED = {
  event: "recommendations_see_more_clicked";
  properties: {
    media_id: ID;
    media_type: MediaType;
  };
};

export type TICKETS_CLICKED = {
  event: "tickets_clicked";
  properties: {
    media_id: ID;
    media_type: MediaType;
  };
};

export type Events =
  | TRAILER_PAUSED
  | TRAILER_PLAYED
  | MEDIA_SAVE_CLICKED
  | MEDIA_UNSAVE_CLICKED
  | MEDIA_SEEN_CLICKED
  | MEDIA_RATED
  | MEDIA_UNSEEN_CLICKED
  | MEDIA_RATING_SKIPPED
  | POSTER_EXPANDED
  | PERSON_CLICKED
  | GENRE_CLICKED
  | POSTER_CLICKED
  | POSTER_LONG_PRESSED
  | NAVIGATION_CLICKED
  | SEARCH_SUBMITTED
  | FILTERS_OPENED
  | FILTERS_APPLIED
  | PROFILE_TAB_CHANGED
  | PROFILE_SAVED_TAB_CLICKED
  | PROFILE_SEEN_TAB_CLICKED
  | AUTOPLAY_TOGGLED
  | CACHE_CLEARED
  | AUTH_SKIPPED
  | COLLECTION_CLICKED
  | OTP_REQUESTED
  | LOGIN_COMPLETED
  | LOGOUT
  | ACCOUNT_DELETED
  | MEDIA_DETAILS_VIEWED
  | WATCH_PROVIDERS_CLICKED
  | RECOMMENDATIONS_SEE_MORE_CLICKED
  | TICKETS_CLICKED;

export type Event = Events["event"];
export type Properties<E extends Event> = Extract<
  Events,
  { event: E }
>["properties"];
