/* eslint-disable @typescript-eslint/no-require-imports */
import { useFonts } from "expo-font";

export const maziusFonts = {
  MaziusDisplay: require("./MaziusDisplay/MaziusDisplay-Regular.woff2"),
  "MaziusDisplay-Bold": require("./MaziusDisplay/MaziusDisplay-Bold.woff2"),
  "MaziusDisplay-Italic": require("./MaziusDisplay/MaziusDisplay-Extraitalic.woff2"),
  "MaziusDisplay-BoldItalic": require("./MaziusDisplay/MaziusDisplay-ExtraItalicBold.woff2"),
};

export const useMaziusFonts = () => {
  return useFonts(maziusFonts);
};
