import { MMKVStore } from "@/features/common/data/utils/mmkv-store";
import { STORAGE_IDS } from "@/features/common/data/utils/storage-keys";

// PostHog's customStorage accepts a sync key-value store.
export const posthogStorage = new MMKVStore(STORAGE_IDS.POSTHOG);
