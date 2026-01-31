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
