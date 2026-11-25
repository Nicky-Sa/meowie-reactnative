import axios from "axios";
import { env } from "@/lib/env";
import { GENERAL_TIMEOUT } from "@/lib/consts";
import { posthog } from "@/features/general/posthog/client";
import { getAppHeaders } from "@/features/common/data/headers";
import {
  getDeviceSecret,
  saveNewDeviceSecret,
} from "@/features/common/data/utils/device-secret";

// Shared by every request, so requests sent together at launch don't each make their own secret or registration
let registration: Promise<void> | null = null;

const sendRegistration = async () => {
  try {
    const deviceCode = posthog.getDeviceId();
    const secret =
      (await getDeviceSecret(deviceCode)) ??
      (await saveNewDeviceSecret(deviceCode));
    // Plain axios, because the app's own instance waits for this registration before every request
    await axios.post(
      `${env.EXPO_PUBLIC_BACKEND_URL}/v1/device`,
      { secret },
      { headers: await getAppHeaders(), timeout: GENERAL_TIMEOUT },
    );
  } catch (error) {
    // Lets the next request try again, like after the phone was offline
    registration = null;
    throw error;
  }
};

/** Registers the phone with the backend once per app launch. */
export const registerDevice = async () => {
  registration ??= sendRegistration();
  await registration;
};
