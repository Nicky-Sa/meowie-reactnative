import { createMMKV } from "react-native-mmkv";
import { Cache, State } from "swr";

export const storage = createMMKV({ id: "swr-cache" });

/**
 * Granular Provider: Each SWR key is a unique key in MMKV.
 * This prevents massive JSON serialization overhead.
 */
export function swrCacheProvider<Data = unknown>(): Cache<Data> {
  return {
    get: (key: string) => {
      const value = storage.getString(key);
      return value ? (JSON.parse(value) as State<Data>) : undefined;
    },
    set: (key: string, value: State<Data>) => {
      storage.set(key, JSON.stringify(value));
    },
    delete: (key: string) => {
      storage.remove(key);
    },
    // Note: MMKV does not support an iterator for keys directly in this way.
    // For SWR, keys() is primarily used for cache clear/mutation patterns.
    keys: () => new Map<string, State<Data>>().keys(),
  };
}
