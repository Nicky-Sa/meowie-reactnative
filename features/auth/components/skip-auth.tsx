import { Button } from "@/features/common/ui/button";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";

export const SkipAuth = () => {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromOnboarding = from === "onboarding";

  const { dismissScreen } = useDismissScreen();
  const { auth } = useAnalytics();
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const skip = () => {
    auth.trackAuthSkipped();
    appStorage.setItem(APP_STORAGE_KEYS.SKIPPED_AUTH, "true");
    dismissScreen();
  };

  const onPress = () => {
    // Coming from onboarding, confirm before dropping into guest mode.
    if (fromOnboarding) {
      bottomSheetRef.current?.present();
      return;
    }
    skip();
  };

  const onContinueAsGuest = () => {
    bottomSheetRef.current?.dismiss();
    skip();
  };

  return (
    <>
      <Button onPress={onPress} variant={"ghost"} size={"md"}>
        Skip
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        title="Explore without a profile?"
        enableDynamicSizing
        footer={
          <View className="flex flex-row gap-3">
            <View className="flex-1">
              <Button variant="black" size="lg" onPress={onContinueAsGuest}>
                Continue as guest
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="white"
                size="lg"
                onPress={() => bottomSheetRef.current?.dismiss()}
              >
                Let&#39;s login
              </Button>
            </View>
          </View>
        }
      >
        <View className="my-2">
          <Text className="body-b2 text-neutral-5-default">
            By continuing as a guest, we won&#39;t be able to learn your taste
            and build your ultimate movie and series watchlist.
          </Text>
        </View>
      </BottomSheet>
    </>
  );
};
