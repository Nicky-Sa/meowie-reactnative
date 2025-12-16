import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";
import { Filters, initialFiltersValue } from "@/atoms";
import _ from "lodash";

export const tailwind = resolveConfig(tailwindConfig);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isDarkColor = (hexColor: string): boolean => {
  // Remove the '#' if it exists
  const hex = hexColor.replace("#", "");

  // Convert the hex color to RGB features
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate the relative luminance using the W3C formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return true if the luminance is less than 0.5 (dark color)
  return luminance < 0.5;
};

export const isUrl = (text: string): boolean => {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const filterToQuery = (filters: Filters) => {
  return `${Object.entries(filters)
    .filter(
      ([key, value]) =>
        !_.isEqual(value, initialFiltersValue[key as keyof Filters]),
    )
    .map(([key, value]) => `${key}=${value.toString()}`)
    .join("&")}`;
};
