import { createMMKV } from "react-native-mmkv";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = createMMKV({
  id: "app-storage",
});

/**
 * A helper to get a value from MMKV, with a fallback to AsyncStorage
 * if it hasn't been migrated yet.
 */
export const getWithMigration = async (key: string): Promise<string | null> => {
  // 1. Check if it exists in MMKV
  if (storage.contains(key)) {
    return storage.getString(key) ?? null;
  }

  // 2. If not, check AsyncStorage
  const oldVal = await AsyncStorage.getItem(key);

  // 3. If found in AsyncStorage, migrate it to MMKV
  if (oldVal !== null) {
    storage.set(key, oldVal);
    // Remove from AsyncStorage to clean up
    await AsyncStorage.removeItem(key);
    console.log(`Migrated key "${key}" from AsyncStorage to MMKV`);
    return oldVal;
  }

  return null;
};

export const AppStorage = {
  getItem: getWithMigration,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
  contains: (key: string) => {
    return storage.contains(key);
  },
};
