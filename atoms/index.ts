import { tailwind } from "@/lib/utils";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const isYTPlayingAtom = atom(true);
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

export type Filters = {
  genres: string[];
  languages: string[];
  decades: string[];
};

export const filtersAtom = atomWithImmer<Filters>({
  genres: [],
  languages: [],
  decades: [],
});
