import { globalSWRCache } from "@/features/common/data/swr/cache";
import { SWRConfiguration } from "swr";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const getProvider = () => globalSWRCache;

export const swrConfig: SWRConfiguration = {
  provider: getProvider,
  keepPreviousData: false,
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
