import { createMMKV } from "react-native-mmkv";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

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
