import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "app-storage",
});

export const AppStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
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
