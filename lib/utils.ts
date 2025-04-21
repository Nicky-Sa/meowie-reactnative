import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

export const tailwind = resolveConfig(tailwindConfig);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
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


export const objectHasSomeValues = (obj: Record<string, unknown[]>): boolean => {
  return Object.values(obj).some((value) => value.length > 0);
}
