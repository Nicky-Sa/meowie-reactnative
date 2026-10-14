import { Stack, usePathname } from "expo-router";
import { View } from "react-native";
import {
  InnerScreen,
  INNER_SCREEN_HORIZONTAL_PADDING,
} from "@/features/common/layout/inner-screen";
import { TasteProgress } from "@/features/taste/elements/taste-progress";
import { stepHeaderForPath } from "@/features/taste/elements/step-header";
import { ErrorState } from "@/features/general/error-state";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";

// The saving screen has no step title or progress bar, so it sits outside this group.
export default function TasteJourneyLayout() {
  const pathname = usePathname();
  // Every step needs the journey, so its failure is handled once here instead
  // of leaving each step on a spinner that never ends.
  const { data: journey, isError, refetch } = useFetchJourney();
  const { title, step, totalSteps } = stepHeaderForPath(
    pathname,
    journey?.minMoviesToLike,
  );

  if (isError) {
    return (
      <InnerScreen title={title}>
        <ErrorState
          tryAgain={() => void refetch()}
          error={
            "We couldn't load the taste journey. Check your connection and try again."
          }
        />
      </InnerScreen>
    );
  }

  return (
    // fullWidth so the Stack reaches x=0 — otherwise the iOS edge swipe misses
    // it and pops the whole taste route instead of going back one step. The
    // padding moves to contentStyle so the screens still line up.
    <InnerScreen title={title} fullWidth>
      <View className={"flex-1 gap-4"}>
        <View className={"px-4"}>
          <TasteProgress step={step} total={totalSteps} />
        </View>
        <View className={"flex-1"}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              contentStyle: {
                paddingHorizontal: INNER_SCREEN_HORIZONTAL_PADDING,
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="series" />
            <Stack.Screen name="preferences" />
          </Stack>
        </View>
      </View>
    </InnerScreen>
  );
}
