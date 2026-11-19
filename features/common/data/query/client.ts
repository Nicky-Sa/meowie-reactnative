import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { APICallError } from "@/features/common/data/error";

/**
 * Configure React Query's focus manager for React Native.
 * Triggers refetch when the app returns from background.
 */
function setupFocusManager() {
  let appState = AppState.currentState;

  const subscription = AppState.addEventListener("change", (nextAppState) => {
    /* If it's resuming from background or inactive mode to active one */
    if (appState?.match(/inactive|background/) && nextAppState === "active") {
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
        const status = error instanceof APICallError ? error.status : undefined;
        // A 4xx is the backend's final answer, like a 404 or a 401 after Axios already tried to refresh.
        // 429 is the exception: the rate limit lets a later try through.
        if (
          status !== undefined &&
          status >= 400 &&
          status < 500 &&
          status !== 429
        ) {
          return false;
        }

        return failureCount < 3;
      },
      retryDelay: 3000, // 3 seconds
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
