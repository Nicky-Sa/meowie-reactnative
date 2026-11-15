import { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { useQuery } from "@tanstack/react-query";
import { env } from "@/lib/env";
import { GENERAL_TIMEOUT } from "@/lib/consts";
import * as Localization from "expo-localization";
import { countryCodeAtom } from "@/atoms";
import { useSetAtom } from "jotai";

// We use a YouTube-specific 204 endpoint.
// If this fails but the internet is on, we know YouTube specifically is blocked.
const YOUTUBE_CANARY = "https://www.youtube.com/generate_204";
const BACKEND_CANARY = `${env.EXPO_PUBLIC_BACKEND_URL}/health`;

type CheckResult =
  | "RESTRICTED" // Radio ON, but YouTube is blocked
  | "SERVER_ERROR" // YouTube works, Backend fails
  | "ONLINE";

type ConnectivityStatus =
  | "CHECKING"
  | "OFFLINE" // No network connection
  | CheckResult;

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

const checkConnection = async (): Promise<CheckResult> => {
  const [youtubeAlive, backendAlive] = await Promise.all([
    checkUrl(YOUTUBE_CANARY, "HEAD"),
    checkUrl(BACKEND_CANARY, "GET", GENERAL_TIMEOUT),
  ]);

  if (youtubeAlive && backendAlive) return "ONLINE";
  // YouTube works, Backend dead -> Our fault
  if (youtubeAlive) return "SERVER_ERROR";
  // YouTube is dead (regardless of backend status).
  // Since NetInfo says we have a signal, this is almost certainly a block.
  return "RESTRICTED";
};

/** Asks an IP service for the country, and falls back to the device region when it can't. */
const getCountryCode = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for location
  try {
    const ipResponse = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });
    const ipData: { country_code?: string } = await ipResponse.json();
    if (ipData?.country_code) return ipData.country_code;
    throw new Error("No country code in response");
  } catch (error: unknown) {
    console.warn(
      "Location detection failed, falling back to device region",
      error,
    );
    return Localization.getLocales()[0]?.regionCode || "US";
  } finally {
    clearTimeout(timeoutId);
  }
};

const getStatus = (
  isConnected: boolean | null,
  isChecking: boolean,
  checkResult: CheckResult | undefined,
): ConnectivityStatus => {
  if (isConnected === false) return "OFFLINE";
  if (isChecking || !checkResult) return "CHECKING";
  return checkResult;
};

export const useConnectionCheck = () => {
  const netInfo = useNetInfo();
  const setCountryCode = useSetAtom(countryCodeAtom);

  const {
    data: checkResult,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["connection-check"],
    queryFn: checkConnection,
    // React Query pauses requests while the phone looks offline, and this check is what tells us why.
    networkMode: "always",
    // Coming back online runs the check again, because the query turns on and its result is always stale.
    enabled: netInfo.isConnected === true,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (checkResult !== "ONLINE") return;
    // getCountryCode catches its own failures and falls back to the device region, so this never fails.
    void getCountryCode().then(setCountryCode);
  }, [checkResult, setCountryCode]);

  const status = getStatus(netInfo.isConnected, isFetching, checkResult);

  return {
    status,
    refresh: refetch,
    isOffline: status === "OFFLINE",
    isRestricted: status === "RESTRICTED",
  };
};
