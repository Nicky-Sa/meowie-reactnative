import { useRef } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Button } from "@/features/common/ui/button";
import { ExposedBottomSheetModalRef } from "@/features/common/ui/bottom-sheet";
import { StartOverSheet } from "@/features/settings/taste/elements/start-over-sheet";

export const Screen = () => {
  const router = useRouter();
  const startOverSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const startOver = () => {
    startOverSheetRef.current?.dismiss();
    router.replace("/taste");
  };

  return (
    <InnerScreen title={"My taste"}>
      <View className={"mt-4 flex flex-1 flex-col gap-6"}>
        <Text className={"body-b1 text-neutral-8-default"}>
          Your taste helps choose the movies and series in your home feed. Start
          over to update your preferences.
        </Text>
        <Button
          variant={"black"}
          size={"lg"}
          onPress={() => startOverSheetRef.current?.present()}
        >
          Start over
        </Button>
      </View>

      <StartOverSheet ref={startOverSheetRef} onStartOver={startOver} />
    </InnerScreen>
  );
};
