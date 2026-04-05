import { Button } from "@/features/common/ui/button";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";
import EmptyCacheSvg from "@/assets/images/profile/empty-cache.svg";
import { Image } from "expo-image";
import { Action } from "@/features/common/ui/action";
import { useClearQueryCache } from "@/features/general/data/useClearQueryCache";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

export const EmptyCache = () => {
  const { capture } = useCaptureEvent();
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const { clearCache } = useClearQueryCache();

  const clearImageCache = async () => {
    await Image.clearDiskCache();
  };

  const handleEmptyCache = async () => {
    try {
      await clearImageCache();
      await clearCache();
      capture("cache_cleared");
    } catch (error) {
      console.log({ error });
    }
    bottomSheetRef.current?.dismiss();
  };

  return (
    <>
      <Action
        variant={"black"}
        size={"lg"}
        onPress={() => bottomSheetRef.current?.present()}
      >
        Empty Cache
      </Action>
      <BottomSheet
        ref={bottomSheetRef}
        title={"Empty Cache"}
        index={0}
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
