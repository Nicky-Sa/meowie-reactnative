import { createMMKV } from "react-native-mmkv";
import { Cache as SWRCache, State } from "swr";

const MAX_ENTRIES = 5000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const storage = createMMKV({ id: "swr-cache" });

type Cache<Data> = SWRCache<Data> & {
  empty: () => void;
};

/**
 * Granular Provider: Each SWR key is a unique key in MMKV.
 * This prevents massive JSON serialization overhead.
 */
function createSWRProvider<Data = unknown>(): Cache<Data> {
  return {
    get: (key: string) => {
      const value = storage.getString(key);
      if (!value) return undefined;

      try {
        // We include our custom _timestamp for expiry checks
        const state = JSON.parse(value) as State<Data> & { _timestamp: number };

        // ENFORCE HARD EXPIRY (e.g., 3 Days)
        // Even if SWR wants to show 'stale' data, we decide it's too old.
        const isTooOld = Date.now() - state._timestamp > THREE_DAYS_MS;

        if (isTooOld) {
          storage.remove(key);
          return undefined; // Force SWR to treat this as a fresh start
        }

        return state;
      } catch (e) {
        // Handle cases where JSON might be corrupted
        console.error(`Cache parse error for key: ${key}`, e);
        storage.remove(key);
        return undefined;
      }
    },
    set: (key: string, value: State<Data>) => {
      const allKeys = storage.getAllKeys();

      // If we exceed our entry limit, remove the oldest 20% to make room
      if (allKeys.length > MAX_ENTRIES) {
        const keysToRemove = allKeys.slice(0, Math.floor(MAX_ENTRIES * 0.2));
        keysToRemove.forEach((k) => storage.remove(k));
      }

      storage.set(key, JSON.stringify({ ...value, _timestamp: Date.now() }));
    },
    delete: (key: string) => {
      storage.remove(key);
    },
    empty: () => {
      storage.clearAll();
    },
    keys: () => {
      const allKeys = storage.getAllKeys();
      return allKeys[Symbol.iterator]();
    },
  };
}

export const globalSWRCache = createSWRProvider();
