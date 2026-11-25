import { getDefaultStore } from "jotai";
import { getCalendars } from "expo-localization";
import { countryCodeAtom } from "@/atoms";
import { posthog } from "@/features/general/posthog/client";
import { getDeviceSecret } from "@/features/common/data/utils/device-secret";

/** Every x- header a backend request sends. */
export const getAppHeaders = async (): Promise<Record<string, string>> => {
  const deviceCode = posthog.getDeviceId();
  const deviceSecret = await getDeviceSecret(deviceCode);
  // For localized content
  const countryCode = getDefaultStore().get(countryCodeAtom);
  const timeZone = getCalendars()[0].timeZone;

  return {
    "x-device-code": deviceCode,
    ...(deviceSecret ? { "x-device-secret": deviceSecret } : {}),
    ...(countryCode ? { "x-user-country": countryCode } : {}),
    ...(timeZone ? { "x-time-zone": timeZone } : {}),
  };
};
