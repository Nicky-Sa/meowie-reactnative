import { useState, useCallback, useEffect, useRef } from "react";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { env } from "@/lib/env";
import { GENERAL_TIMEOUT } from "@/lib/consts";

// We use a YouTube-specific 204 endpoint.
// If this fails but the internet is on, we know YouTube specifically is blocked.
const YOUTUBE_CANARY = "https://www.youtube.com/generate_204";
const BACKEND_CANARY = env.EXPO_PUBLIC_BACKEND_URL;

type ConnectivityStatus =
  | "CHECKING"
  | "OFFLINE" // Radio is OFF
  | "RESTRICTED" // Radio ON, but YouTube is blocked
  | "SERVER_ERROR" // YouTube works, Backend fails
  | "ONLINE";

export const useConnectionCheck = () => {
  const [status, setStatus] = useState<ConnectivityStatus>("CHECKING");
  const wasOffline = useRef(true);
  const netInfo = useNetInfo();

  const checkConnectivity = useCallback(async () => {
    setStatus("CHECKING");

    // 1. Hardware Check
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      setStatus("OFFLINE");
      wasOffline.current = true;
      return;
    }

    // 2. Canary Pings
    const checkUrl = async (url: string, timeout = 3000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout); // 3s Timeout
      try {
        // We use 'no-cache' to ensure we aren't reading a stale success from memory and pass a query string to bypass cache.
        const response = await fetch(`${url}?t=${Date.now()}`, {
          method: "HEAD",
          cache: "no-cache",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        // YouTube's 204 endpoint returns 204.
        // Standard APIs might return 200.
        return response.status === 204 || response.ok;
      } catch {
        return false;
      }
    };

    const [youtubeAlive, backendAlive] = await Promise.all([
      checkUrl(YOUTUBE_CANARY),
      checkUrl(BACKEND_CANARY, GENERAL_TIMEOUT),
    ]);

    // 3. Logic Determination
    if (youtubeAlive && backendAlive) {
      setStatus("ONLINE");
      wasOffline.current = false;
    } else if (youtubeAlive && !backendAlive) {
      // YouTube works, Backend dead -> Our fault
      setStatus("SERVER_ERROR");
      wasOffline.current = true;
    } else {
      // YouTube is dead (regardless of backend status).
      // Since NetInfo says we have a signal, this is almost certainly a block.
      setStatus("RESTRICTED");
      wasOffline.current = true;
    }
  }, []);

  // Auto-recovery
  useEffect(() => {
    if (netInfo.isConnected && wasOffline.current) {
      checkConnectivity();
    }
  }, [netInfo.isConnected, checkConnectivity]);

  return {
    status,
    refresh: checkConnectivity,
    isChecking: status === "CHECKING",
    isOffline: status === "OFFLINE",
    isRestricted: status === "RESTRICTED",
    isBackendUnreachable: status === "SERVER_ERROR",
    isOnline: status === "ONLINE",
  };
};
