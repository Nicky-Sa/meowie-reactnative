import { MMKVStore } from "@/features/common/data/utils/mmkv-store";
import {
  STORAGE_IDS,
  AppStorageKey,
} from "@/features/common/data/utils/storage-keys";

export const appStorage = new MMKVStore<AppStorageKey>(STORAGE_IDS.APP_STORAGE);
