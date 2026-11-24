import { Href } from "expo-router";

export const isUrl = (text: string): boolean => {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const searchParamsToQuery = (
  searchParams: Record<string, string | string[]> | undefined,
) => {
  if (!searchParams) return "";

  return Object.keys(searchParams)
    .sort()
    .flatMap((key) => {
      const value = searchParams[key];
      if (Array.isArray(value)) {
        if (value.length === 0) return [];
        return `${key}=${value.map((v) => encodeURIComponent(v)).join(",")}`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join("&");
};

/** A link from outside can name any path; one that matches no screen opens the not-found screen. */
export const isAppPath = (value: unknown): value is Href & string =>
  typeof value === "string" && value.startsWith("/");
