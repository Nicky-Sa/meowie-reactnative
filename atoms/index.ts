import { tailwind } from "@/lib/utils";
import { atom } from "jotai";

export const isMuteAtom = atom(false)
export const colorAtom = atom(tailwind.theme.colors.primary[300]);