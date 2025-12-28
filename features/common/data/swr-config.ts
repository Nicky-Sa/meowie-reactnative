import { createMMKV } from "react-native-mmkv";
import useSWR, { Cache, State, SWRConfiguration } from "swr";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { fetcher } from "@/features/common/data/fetcher";
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteKeyLoader,
} from "swr/infinite";
import { SuccessResponse } from "@/features/common/data/transformers";

const MAX_ENTRIES = 5000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const storage = createMMKV({ id: "swr-cache" });

/**
 * Granular Provider: Each SWR key is a unique key in MMKV.
 * This prevents massive JSON serialization overhead.
 */
export function createSWRProvider<Data = unknown>(): Cache<Data> {
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
    keys: () => {
      const allKeys = storage.getAllKeys();
      return allKeys[Symbol.iterator]();
    },
  };
}

const providerInstance = createSWRProvider();

export const swrConfig: SWRConfiguration = {
  provider: () => providerInstance,
  keepPreviousData: true,
  shouldRetryOnError: true,
  dedupingInterval: 10 * 60 * 1000, // 10 minutes
  errorRetryInterval: 3000, // 3 seconds
  errorRetryCount: 3,
  revalidateOnFocus: true,
  initFocus(callback) {
    let appState = AppState.currentState;
    const onAppStateChange = (nextAppState: AppStateStatus) => {
      /* If it's resuming from background or inactive mode to active one */
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        callback();
      }
      appState = nextAppState;
    };
    // Subscribe to the app state change events
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => {
      subscription.remove();
    };
  },
  revalidateOnReconnect: true,
  initReconnect(callback) {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        callback();
      }
    });
    return () => {
      unsubscribe();
    };
  },
  // Tells SWR if the app is currently visible
  isVisible: () => AppState.currentState === "active",
};

export const useSWRConfigured = <Data, Err = Error>(
  key: string | null,
  config?: SWRConfiguration<SuccessResponse<Data>, Err>,
) => {
  return useSWR<SuccessResponse<Data>, Err>(key, fetcher, config);
};

export const useSWRInfiniteConfigured = <Data, Err = Error>(
  getKey: SWRInfiniteKeyLoader,
  config?: SWRInfiniteConfiguration<SuccessResponse<Data>, Err>,
) => {
  return useSWRInfinite<SuccessResponse<Data>, Err>(getKey, fetcher, {
    ...swrConfig,
    persistSize: true,
    revalidateFirstPage: false,
    ...config,
  });
};
