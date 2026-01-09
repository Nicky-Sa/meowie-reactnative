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

export type Events = SORT_OPENED | SORT_APPLIED;
export type Event = Events["event"];
export type Properties<E extends Event> = Extract<
  Events,
  { event: E }
>["properties"];
