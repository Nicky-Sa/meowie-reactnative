import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const tailwind = resolveConfig(tailwindConfig);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
