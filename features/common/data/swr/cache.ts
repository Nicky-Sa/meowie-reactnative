import { createMMKV } from "react-native-mmkv";
import { Cache as SWRCache, State } from "swr";
import { stringify, parse } from "flatted";

const MAX_ENTRIES = 5000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const storage = createMMKV({ id: "swr-cache" });

export type Cache<Data> = SWRCache<Data> & {
  clear: () => void;
};

/**
 * Granular Provider: Each SWR key is a unique key in MMKV.
 * This prevents massive JSON serialization overhead.
 */
export function createSWRProvider<Data = unknown>(): Cache<Data> {
  // In-memory map to maintain referential stability.
  // This prevents React from detecting "changes" when we just parse the same JSON string, but stored in different memory locations.
  const map = new Map<string, State<Data> & { _timestamp: number }>();

  return {
    get: (key: string) => {
      // 1. Check Memory (Fast & Stable)
      // If we have it in RAM, return the exact same object reference.
      const cached = map.get(key);
      if (cached) {
        // Check expiry on the memory object
        const isTooOld = Date.now() - cached._timestamp > THREE_DAYS_MS;
        if (isTooOld) {
          map.delete(key);
          storage.remove(key);
          return undefined;
        }
        return cached;
      }

      // 2. Check Disk (Persistence)
      const value = storage.getString(key);
      if (!value) return undefined;

      try {
        // We include our custom _timestamp for expiry checks
        const state = parse(value) as State<Data> & { _timestamp: number };

        // ENFORCE HARD EXPIRY (e.g., 3 Days)
        // Even if SWR wants to show 'stale' data, we decide it's too old.
        const isTooOld = Date.now() - state._timestamp > THREE_DAYS_MS;

        if (isTooOld) {
          storage.remove(key);
          return undefined; // Force SWR to treat this as a fresh start
        }

        // 3. Hydrate Memory
        // Save the parsed object to the Map so next time we return this SAME reference.
        map.set(key, state);

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
        keysToRemove.forEach((k) => {
          storage.remove(k);
          map.delete(k); // Ensure we clear it from memory too
        });
      }

      const state = { ...value, _timestamp: Date.now() };

      // Update Memory (Instant UI update)
      map.set(key, state);

      // Update Disk (Background persistence)
      storage.set(key, stringify(state));
    },
    delete: (key: string) => {
      map.delete(key);
      storage.remove(key);
    },
    clear: () => {
      map.clear();
      storage.clearAll();
    },
    keys: () => {
      // We rely on storage for the master list of keys,
      // in case the map hasn't fully hydrated yet.
      const allKeys = storage.getAllKeys();
      return allKeys[Symbol.iterator]();
    },
  };
}
