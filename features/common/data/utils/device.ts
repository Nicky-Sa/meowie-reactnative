import axios from "axios";
import { env } from "@/lib/env";
import { GENERAL_TIMEOUT } from "@/lib/consts";
import { posthog } from "@/features/general/posthog/client";
import { getAppHeaders } from "@/features/common/data/headers";
import {
  getDeviceSecret,
  saveNewDeviceSecret,
} from "@/features/common/data/utils/device-secret";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";

// Shared by every request, so requests sent together don't each send their own registration
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
    // Saves the mark in app storage, so a reinstall, which also gives PostHog a new device code, clears it
    appStorage.setItem(APP_STORAGE_KEYS.DEVICE_REGISTERED, "true");
  } finally {
    registration = null;
  }
};

/** Registers the phone with the backend, also when it registered before. */
export const registerDevice = async () => {
  registration ??= sendRegistration();
  await registration;
};
