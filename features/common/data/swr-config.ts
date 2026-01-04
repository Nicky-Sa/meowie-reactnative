import { createMMKV } from "react-native-mmkv";
import useSWR, { Cache, State, SWRConfiguration } from "swr";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";
import { castDraft } from "immer";

const MAX_ENTRIES = 5000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const storage = createMMKV({ id: "swr-cache" });

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
    keys: () => {
      const allKeys = storage.getAllKeys();
      return allKeys[Symbol.iterator]();
    },
  };
}

const globalSWRCache = createSWRProvider();

const getProvider = () => globalSWRCache;

export const swrConfig: SWRConfiguration = {
  provider: getProvider,
  keepPreviousData: true,
  dedupingInterval: 10 * 60 * 1000, // 10 minutes
  shouldRetryOnError: true,
  errorRetryInterval: 3000, // 3 seconds
  errorRetryCount: 3,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // 1. NEVER retry on 401 (Unauthorized)
    //    Axios already tried to refresh. If we are here, it's over.
    if (error.response?.status === 401) return;

    // 2. Stop if we hit the limit defined in 'errorRetryCount' above
    if (retryCount >= config.errorRetryCount!) return;

    // 3. Retry after the interval defined in 'errorRetryInterval' above
    setTimeout(() => revalidate({ retryCount }), config.errorRetryInterval);
  },
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

type SWRKey = string | null;

export const useSWRConfigured = <Data, Err = Error>(
  key: SWRKey,
  config?: SWRConfiguration<SuccessResponse<Data>, Err>,
) => {
  return useSWR<SuccessResponse<Data>, Err>(key, fetcher, config);
};

// Replacement for useSWRInfinite to support pagination and caching!
export type SWRInfiniteKeyLoader<Data> = (
  index: number,
  previousPageData: SuccessResponse<Data> | null,
) => SWRKey;

export const useSWRPaginatedConfigured = <Data, Err = Error>(
  getKey: SWRInfiniteKeyLoader<Data>,
  config?: SWRConfiguration<SuccessResponse<Data>, Err>,
) => {
  const [size, setSize] = useState(1);
  const [data, setData] = useImmer<SuccessResponse<Data>[] | undefined>(
    undefined,
  );

  const previousPageData = data ? data[size - 2] || null : null;
  const key = getKey(size - 1, previousPageData);

  const { data: currentPageData, ...rest } = useSWRConfigured<Data, Err>(
    key,
    config,
  );

  useEffect(() => {
    if (currentPageData) {
      setData((draft) => {
        // Case A: State is currently undefined.
        // We must return a NEW state to replace undefined (Immer rule).
        if (!draft) {
          const newArray = [];
          newArray[size - 1] = currentPageData;
          return newArray;
        }

        // Case B: State is an array.
        // Mutate the draft directly.
        // Reference check to prevent infinite loops:
        if (!_.isEqual(draft[size - 1], currentPageData)) {
          draft[size - 1] = castDraft(currentPageData); // Cast helps TS infer the draft type correctly if strict
        }
      });
    }
  }, [currentPageData, size, setData]);

  return {
    data, // This matches the SWRInfinite return type (array of pages)
    size,
    setSize,
    ...rest,
  };
};

export const useSWRMutationConfigured = <REQ, RES, Err = Error>(
  key: SWRKey,
  config?: SWRMutationConfiguration<
    SuccessResponse<RES>,
    Err,
    SWRKey,
    MutationArg<REQ>
  >,
) => {
  return useSWRMutation<SuccessResponse<RES>, Err, SWRKey, MutationArg<REQ>>(
    key,
    fetcher,
    config,
  );
};
