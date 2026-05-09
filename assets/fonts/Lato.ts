import { useFonts } from "@expo-google-fonts/lato";
import * as Lato from "@expo-google-fonts/lato";

// Filter out non-font exports (__metadata__, useFonts, etc.) from the Lato namespace
const latoFonts = Object.fromEntries(
  Object.entries(Lato).filter(([, value]) => typeof value === "number"),
);

export const useLatoFont = () => {
  return useFonts(latoFonts);
};
