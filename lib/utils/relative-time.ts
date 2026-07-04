const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const pluralize = (value: number, unit: string) =>
  `${value} ${unit}${value === 1 ? "" : "s"} ago`;

/** Coarse "time ago" label for a release note's ISO createdAt. */
export const relativeTime = (isoDate: string): string => {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000),
  );

  if (seconds < MINUTE) return "Just now";
  if (seconds < HOUR) return pluralize(Math.floor(seconds / MINUTE), "minute");
  if (seconds < DAY) return pluralize(Math.floor(seconds / HOUR), "hour");
  if (seconds < WEEK) return pluralize(Math.floor(seconds / DAY), "day");
  if (seconds < MONTH) return pluralize(Math.floor(seconds / WEEK), "week");
  if (seconds < YEAR) return pluralize(Math.floor(seconds / MONTH), "month");
  return pluralize(Math.floor(seconds / YEAR), "year");
};
