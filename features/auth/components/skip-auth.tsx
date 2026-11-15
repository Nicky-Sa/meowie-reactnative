import { Button } from "@/features/common/ui/button";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";

export const SkipAuth = () => {
  const { from, returnTo } = useLocalSearchParams<{
    from?: string;
    returnTo?: string;
  }>();
  const fromOnboarding = from === "onboarding";

  const { dismissScreen } = useDismissScreen({ returnTo });
  const { auth } = useAnalytics();
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const skip = () => {
    auth.trackAuthSkipped();
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
            <Button
              variant="black"
              size="lg"
              fullWidth
              onPress={onContinueAsGuest}
            >
              Continue as guest
            </Button>
            <Button
              variant="white"
              size="lg"
              fullWidth
              onPress={() => bottomSheetRef.current?.dismiss()}
            >
              Let&#39;s login
            </Button>
          </View>
        }
      >
        <View className="my-2">
          <Text className="body-b2 text-neutral-5-default">
            You can keep exploring as a guest. You can sign in later to save
            your taste and watchlist to your account.
          </Text>
        </View>
      </BottomSheet>
    </>
  );
};
