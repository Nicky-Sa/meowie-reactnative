import { ID } from "@/features/common/data/query";

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
    movie_id: ID;
    movie_title: string;
    autoplay: boolean;
  };
};

export type TRAILER_PAUSED = {
  event: "trailer_paused";
  properties: {
    movie_id: ID;
    movie_title: string;
  };
};

export type AUTOPLAY_TOGGLED = {
  event: "autoplay_toggled";
  properties: {
    autoplay: boolean;
  };
};

export type MOVIE_BOOKMARKED = {
  event: "movie_bookmarked";
  properties: {
    movie_id: ID;
    movie_title: string;
    genres: string[];
  };
};

export type MOVIE_UNBOOKMARKED = {
  event: "movie_unbookmarked";
  properties: {
    movie_id: ID;
    movie_title: string;
    genres: string[];
  };
};

export type Events =
  | SORT_OPENED
  | SORT_APPLIED
  | TRAILER_PAUSED
  | TRAILER_PLAYED
  | AUTOPLAY_TOGGLED
  | MOVIE_BOOKMARKED
  | MOVIE_UNBOOKMARKED;
export type Event = Events["event"];
export type Properties<E extends Event> = Extract<
  Events,
  { event: E }
>["properties"];
