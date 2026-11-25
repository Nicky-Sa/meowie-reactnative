import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { SECURE_STORE_KEYS } from "@/features/common/data/utils/storage-keys";

let secretDeviceCode: string | null = null;
let deviceSecret: string | null = null;

const createSecret = () =>
  Array.from(Crypto.getRandomBytes(32), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

/** Gives the saved secret, or null when there is none for this device code. */
export const getDeviceSecret = async (
  deviceCode: string,
): Promise<string | null> => {
  if (!deviceSecret) {
    secretDeviceCode = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.DEVICE_CODE,
    );
    deviceSecret = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.DEVICE_SECRET,
    );
  }
  // The keychain outlives a reinstall but PostHog's device id doesn't, so a secret only counts for its own code
  return secretDeviceCode === deviceCode ? deviceSecret : null;
};

/** Makes a new secret for this device code and saves it. */
export const saveNewDeviceSecret = async (deviceCode: string) => {
  const newSecret = createSecret();
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.DEVICE_SECRET, newSecret);
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.DEVICE_CODE, deviceCode);
  secretDeviceCode = deviceCode;
  deviceSecret = newSecret;
  return newSecret;
};
