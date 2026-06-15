import { createMMKV } from "react-native-mmkv";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
import { produce } from "immer";
import type { Draft } from "immer";
import type { WritableAtom } from "jotai/vanilla";

const storage = createMMKV({ id: "persisted-atoms" });

const mmkvJotaiWrapper = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

const getStorage = <T>() => {
  return createJSONStorage<T>(() => mmkvJotaiWrapper);
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
): WritableAtom<T, [T | ((draft: Draft<T>) => void)], void> => {
  const baseAtom = atomWithStorage<T>(key, initialValue, getStorage<T>());

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
