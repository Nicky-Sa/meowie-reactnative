import { useState, useCallback, useEffect, useRef } from "react";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { env } from "@/lib/env";
import { GENERAL_TIMEOUT } from "@/lib/consts";
import * as Localization from "expo-localization";
import { countryCodeAtom } from "@/atoms";
import { useAtom } from "jotai";

// We use a YouTube-specific 204 endpoint.
// If this fails but the internet is on, we know YouTube specifically is blocked.
const YOUTUBE_CANARY = "https://www.youtube.com/generate_204";
const BACKEND_CANARY = `${env.EXPO_PUBLIC_BACKEND_URL}/health`;

type ConnectivityStatus =
  | "CHECKING"
  | "OFFLINE" // No network connection
  | "RESTRICTED" // Radio ON, but YouTube is blocked
  | "SERVER_ERROR" // YouTube works, Backend fails
  | "ONLINE";

export const useConnectionCheck = () => {
  const [status, setStatus] = useState<ConnectivityStatus>("CHECKING");
  const checkOnReconnect = useRef(true);
  const netInfo = useNetInfo();
  const [, setCountryCode] = useAtom(countryCodeAtom);

  const checkConnectivity = useCallback(async () => {
    setStatus("CHECKING");

    // 1. Hardware Check
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      setStatus("OFFLINE");
      checkOnReconnect.current = true;
      return;
    }

    // 2. Canary Pings
    const checkUrl = async (
      url: string,
      method: "HEAD" | "GET" = "HEAD",
      timeout = 3000,
    ) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        // We use 'no-cache' to ensure we aren't reading a stale success from memory and pass a query string to bypass cache.
        const response = await fetch(`${url}?t=${Date.now()}`, {
          method,
          cache: "no-cache",
          signal: controller.signal,
        });
        // YouTube's 204 endpoint returns 204.
        // Standard APIs might return 200.
        return response.status === 204 || response.ok;
      } catch {
        // A failed or timed-out ping means the service can't be reached.
        return false;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const [youtubeAlive, backendAlive] = await Promise.all([
      checkUrl(YOUTUBE_CANARY, "HEAD"),
      checkUrl(BACKEND_CANARY, "GET", GENERAL_TIMEOUT),
    ]);

    // 3. Logic Determination
    if (youtubeAlive && backendAlive) {
      setStatus("ONLINE");
      checkOnReconnect.current = false;

      // 4. IP-based Country Detection (only if online)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for location

        const ipResponse = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const ipData = (await ipResponse.json()) as { country_code?: string };

        if (ipData?.country_code) {
          setCountryCode(ipData.country_code);
        } else {
          throw new Error("No country code in response");
        }
      } catch (error: unknown) {
        // Fallback to device region
        const deviceRegion = Localization.getLocales()[0]?.regionCode || "US";
        setCountryCode(deviceRegion);
        console.warn(
          "Location detection failed, falling back to device region",
          error,
        );
      }
    } else if (youtubeAlive && !backendAlive) {
      // YouTube works, Backend dead -> Our fault
      setStatus("SERVER_ERROR");
      checkOnReconnect.current = true;
    } else {
      // YouTube is dead (regardless of backend status).
      // Since NetInfo says we have a signal, this is almost certainly a block.
      setStatus("RESTRICTED");
      checkOnReconnect.current = true;
    }
  }, [setCountryCode]);

  // Going offline mid-use sets the status too, and coming back runs the check again.
  useEffect(() => {
    if (netInfo.isConnected === false) {
      setStatus("OFFLINE");
      checkOnReconnect.current = true;
    } else if (netInfo.isConnected && checkOnReconnect.current) {
      void checkConnectivity();
    }
  }, [netInfo.isConnected, checkConnectivity]);

  return {
    status,
    refresh: checkConnectivity,
    isOffline: status === "OFFLINE",
    isRestricted: status === "RESTRICTED",
  };
};
