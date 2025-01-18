import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getColors } from "react-native-image-colors";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateRandomColors = (count: number = 1) => {
  return Array.from({ length: count }, () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  });
};

export const formatDuration = (minutes?: number) => {
  if (typeof minutes !== "number") return "0h0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes}m`;
};
