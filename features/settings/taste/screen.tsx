import { useRef } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Button } from "@/features/common/ui/button";
import { Loading } from "@/features/common/ui/loading";
import { ExposedBottomSheetModalRef } from "@/features/common/ui/bottom-sheet";
import { ErrorState } from "@/features/general/error-state";
import { PersonalityCard } from "@/features/taste/elements/personality-card";
import { ShareTypeButton } from "@/features/taste/elements/share-type-button";
import { useFetchTaste } from "@/features/taste/data/use-fetch-taste";
import { StartOverSheet } from "@/features/settings/taste/elements/start-over-sheet";

export const Screen = () => {
  const router = useRouter();
  const { data: taste, isLoading, refetch } = useFetchTaste({ enabled: true });
  const startOverSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const startOver = () => {
    startOverSheetRef.current?.dismiss();
    // replace, so the back arrow in the journey leads to settings and not to
    // the card the user just left behind.
    router.replace("/taste");
  };

  return (
    <InnerScreen title={"Meet your type"}>
      {isLoading ? (
        <View className={"flex-1 justify-center"}>
          <Loading />
        </View>
      ) : !taste ? (
        <ErrorState
          tryAgain={refetch}
          error={
            "We couldn't load your taste. Check your connection and try again."
          }
        />
      ) : (
        <View className={"mt-4 flex flex-1 flex-col gap-3"}>
          <View className={"mx-8 flex-1 items-center justify-center"}>
            <PersonalityCard image={taste.personality.image} />
          </View>
          <View className={"flex flex-col gap-3"}>
            <ShareTypeButton personality={taste.personality} />
            <Button
              variant={"black"}
              size={"lg"}
              onPress={() => startOverSheetRef.current?.present()}
            >
              Start over
            </Button>
          </View>
        </View>
      )}

      <StartOverSheet ref={startOverSheetRef} onStartOver={startOver} />
    </InnerScreen>
  );
};
