import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { atom } from "jotai";
import { produce } from "immer";
import type { Draft } from "immer";
import type { WritableAtom } from "jotai";
import { STORAGE_IDS } from "@/features/common/data/utils/storage-keys";
import { MMKVStore } from "@/features/common/data/utils/mmkv-store";

const storage = new MMKVStore(STORAGE_IDS.PERSISTED_ATOMS);

const getStorage = <T>() => {
  return createJSONStorage<T>(() => storage);
};

export const atomPersisted = <T>(key: string, initialValue: T) => {
  return atomWithStorage<T>(key, initialValue, getStorage<T>());
};

/**
 * Combines MMKV persistence (atomWithStorage) with immer draft mutations.
 * The setter accepts either a direct value or an immer updater function.
 */
export const atomPersistedWithImmer = <T>(
  key: string,
  initialValue: T,
  getOnInit = false,
): WritableAtom<T, [T | ((draft: Draft<T>) => void)], void> => {
  const baseAtom = atomWithStorage<T>(key, initialValue, getStorage<T>(), {
    getOnInit,
  });

  const derivedAtom: WritableAtom<T, [T | ((draft: Draft<T>) => void)], void> =
    atom(
      (get) => get(baseAtom),
      (get, set, fn: T | ((draft: Draft<T>) => void)) => {
        const nextValue = produce(
          get(baseAtom),
          typeof fn === "function"
            ? (fn as (draft: Draft<T>) => void)
            : () => fn,
        );
        set(baseAtom, nextValue);
      },
    );

  return derivedAtom;
};
