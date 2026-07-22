import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { FetcherError } from "@/features/common/data/fetcher";

/**
 * Configure React Query's focus manager for React Native.
 * Triggers refetch when the app returns from background.
 */
function setupFocusManager() {
  let appState: AppStateStatus = AppState.currentState;

  const subscription = AppState.addEventListener("change", (nextAppState) => {
    /* If it's resuming from background or inactive mode to active one */
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      focusManager.setFocused(true);
    } else {
      focusManager.setFocused(false);
    }
    appState = nextAppState;
  });

  return () => subscription.remove();
}

/**
 * Configure React Query's online manager for React Native.
 * Triggers refetch when network connectivity is restored.
 */
function setupOnlineManager() {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const isOnline = state.isConnected && state.isInternetReachable !== false;
    onlineManager.setOnline(!!isOnline);
  });

  return () => unsubscribe();
}

// Set up both managers immediately
setupFocusManager();
setupOnlineManager();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount, error) => {
        // 1. NEVER retry on 401 (Unauthorized)
        //    Axios already tried to refresh. If we are here, it's over.
        if (error instanceof FetcherError && error.status === 401) return false;

        // 2. Stop if we hit the limit (3 retries)
        return failureCount < 3;
      },
      retryDelay: 3000, // 3 seconds
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
