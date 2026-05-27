import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

/**
 * Tracks the time a user spends on a media info screen.
 * It accounts for app backgrounding by pausing the timer.
 * Captures "media_details_viewed" event on unmount.
 */
export const useTrackTimeSpent = (mediaId: ID, mediaType: MediaType) => {
  const { media } = useAnalytics();
  const startTime = useRef<number>(0);
  const totalDuration = useRef<number>(0);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Reset timer on mount or when media changes
    startTime.current = Date.now();
    totalDuration.current = 0;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // App going to background: accumulate current time slice
        totalDuration.current += Date.now() - startTime.current;
      } else if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App returning to foreground: start a new time slice
        startTime.current = Date.now();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();

      // Final calculation of duration
      const finalDuration =
        appState.current === "active"
          ? totalDuration.current + (Date.now() - startTime.current)
          : totalDuration.current;

      // Only track if the user stayed for more than 500ms (ignoring accidental clicks)
      if (finalDuration > 500) {
        media.trackView({
          mediaId,
          mediaType,
          durationMs: finalDuration,
        });
      }
    };
  }, [mediaId, mediaType, media]);
};
