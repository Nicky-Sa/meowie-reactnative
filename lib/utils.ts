import { Videos } from "@/models/tmdb/info";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDuration = (minutes?: number) => {
  if (typeof minutes !== "number") return "0h0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes}m`;
};

export const isDarkColor = (hexColor: string): boolean => {
  // Remove the '#' if it exists
  const hex = hexColor.replace("#", "");

  // Convert the hex color to RGB components
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate the relative luminance using the W3C formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return true if the luminance is less than 0.5 (dark color)
  return luminance < 0.5;
};

export const findTrailerKey = (videoList: Videos): string => {
  const { results } = videoList;
  const youtubeVideos = results.filter((video) => video.site === "YouTube");

  if (!youtubeVideos) {
    return "";
  }
  // 1. Look for a video that is both Trailer and Official
  const officialTrailer = youtubeVideos.find(
    (video) => video.type === "Trailer" && video.official,
  )?.key;

  if (officialTrailer) {
    return officialTrailer;
  }

  // 2. Look for a video that is a Trailer (regardless of official status)
  const trailer = youtubeVideos.find((video) => video.type === "Trailer")?.key;

  if (trailer) {
    return trailer;
  }

  // 3. Return the first video in the list (if any)
  return youtubeVideos.length > 0 ? youtubeVideos[0].key : "";
};
