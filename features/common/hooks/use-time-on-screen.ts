import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

type Args = {
  /** Change this to end the current stretch and start a new one, e.g. a media id. */
  resetKey?: string | number;
  /** Counting pauses while this is false, on top of the app-background pause. */
  isVisible?: boolean;
  /** Stretches shorter than this are dropped, so accidental taps don't count. */
  minimumMs?: number;
  onLeave: (durationMs: number) => void;
};

/**
 * Counts how long something is actually being looked at: the clock stops while
 * the app is in the background and while `isVisible` is false. Reports the
 * total when it unmounts or `resetKey` changes.
 */
export const useTimeOnScreen = ({
  resetKey,
  isVisible = true,
  minimumMs = 500,
  onLeave,
}: Args) => {
  const onLeaveRef = useRef(onLeave);
  const isVisibleRef = useRef(isVisible);
  const startedAt = useRef(0);
  const total = useRef(0);
  const isCounting = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    onLeaveRef.current = onLeave;
  });

  const startCounting = useCallback(() => {
    if (isCounting.current) return;
    startedAt.current = Date.now();
    isCounting.current = true;
  }, []);

  const stopCounting = useCallback(() => {
    if (!isCounting.current) return;
    total.current += Date.now() - startedAt.current;
    isCounting.current = false;
  }, []);

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible && appState.current === "active") {
      startCounting();
    } else {
      stopCounting();
    }
  }, [isVisible, startCounting, stopCounting]);

  useEffect(() => {
    // Held from the start of this stretch, so a reset reports the stretch that
    // just ended rather than the one beginning now.
    const report = onLeaveRef.current;

    total.current = 0;
    isCounting.current = false;
    if (isVisibleRef.current && appState.current === "active") startCounting();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        stopCounting();
      } else if (
        appState.current?.match(/inactive|background/) &&
        nextState === "active" &&
        isVisibleRef.current
      ) {
        startCounting();
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
      stopCounting();
      if (total.current > minimumMs) report(total.current);
    };
  }, [resetKey, minimumMs, startCounting, stopCounting]);
};
