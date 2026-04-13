import { createMMKV } from "react-native-mmkv";

const phStorage = createMMKV({
  id: "posthog-storage",
});

export const posthogStorage = {
  getItem: async (key: string) => {
    return phStorage.getString(key) ?? null;
  },
  setItem: async (key: string, value: string) => {
    phStorage.set(key, value);
  },
  removeItem: async (key: string) => {
    phStorage.remove(key);
  },
};
