import { createMMKV } from "react-native-mmkv";

/**
 * Thin wrapper around a single MMKV instance (one store per id).
 * Pass a key union as `Key` to restrict access to known keys, e.g.
 * `new MMKVStore<AppStorageKey>(STORAGE_IDS.APP_STORAGE)`.
 */
export class MMKVStore<Key extends string = string> {
  private readonly store: ReturnType<typeof createMMKV>;

  constructor(id: string) {
    this.store = createMMKV({ id });
  }

  getItem = (key: Key): string | null => this.store.getString(key) ?? null;

  setItem = (key: Key, value: string): void => {
    this.store.set(key, value);
  };

  removeItem = (key: Key): void => {
    this.store.remove(key);
  };

  contains = (key: Key): boolean => this.store.contains(key);
}
