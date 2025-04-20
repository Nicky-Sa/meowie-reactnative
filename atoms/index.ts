import { tailwind } from "@/lib/utils";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const isYTPlayingAtom = atom(true);
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);

export type Filters = Record<string, string[]>

export const filtersAtom = atomWithImmer<Filters>({ genres: [], language: [] });
