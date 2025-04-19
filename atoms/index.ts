import { tailwind } from "@/lib/utils";
import { atom } from "jotai";

export const isYTPlayingAtom = atom(true);
export const colorAtom = atom(
  tailwind.theme.backgroundColor.neutral[11].default as string,
);
