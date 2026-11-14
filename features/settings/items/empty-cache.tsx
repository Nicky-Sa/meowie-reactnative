import { Button } from "@/features/common/ui/button";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import EmptyCacheSvg from "@/assets/images/meowie/empty-cache.svg";
import { Image } from "expo-image";
import { Action } from "@/features/common/ui/action";
import { useClearQueryCache } from "@/features/general/data/use-clear-query-cache";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

export const EmptyCache = () => {
  const { settings } = useAnalytics();
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const [isClearing, setIsClearing] = useState(false);

  const { clearCache } = useClearQueryCache();

  const clearImageCache = async () => {
    await Image.clearDiskCache();
  };

  const handleEmptyCache = async () => {
    // The clear waits for every cached query to reload, so the button shows it's working.
    setIsClearing(true);
    settings.trackCacheCleared();
    // Neither call can fail: clearing the image cache only resolves, and React Query catches failed refetches.
    await clearImageCache();
    await clearCache();
    setIsClearing(false);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <>
      <Action
        variant={"black"}
        onPress={() => bottomSheetRef.current?.present()}
      >
        Empty cache
      </Action>
      <BottomSheet
        ref={bottomSheetRef}
        title={"Empty Cache"}
        index={0}
        enableDynamicSizing
        footer={
          <View className={"flex flex-row gap-4"}>
            <Button
              variant="black"
              size="lg"
              className="flex-1"
              onPress={() => {
                bottomSheetRef.current?.dismiss();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="white"
              size="lg"
              className="flex-1"
              onPress={handleEmptyCache}
              isLoading={isClearing}
            >
              Empty Cache
            </Button>
          </View>
        }
      >
        <View className={"flex flex-col items-center gap-4"}>
          <EmptyCacheSvg />
          <Text className={"body-b1 text-center text-neutral-10-default"}>
            Are you sure you want to empty the cache? After this action,
            fetching fresh data will start immediately.
          </Text>
        </View>
      </BottomSheet>
    </>
  );
};
