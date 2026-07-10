import { Stack, usePathname } from "expo-router";
import { View } from "react-native";
import {
  InnerScreen,
  INNER_SCREEN_HORIZONTAL_PADDING,
} from "@/features/common/layout/inner-screen";
import { TasteProgress } from "@/features/taste/elements/taste-progress";
import { stepHeaderForPath } from "@/features/taste/elements/step-header";

// The parts that stay on screen across every wizard step: back button + step
// title from InnerScreen, progress bar below it. Both come from the active
// route and render once here, so they stay put while only the step body slides.
// The reveal needs neither, so it sits outside this group — see ../_layout.tsx.
export default function TasteWizardLayout() {
  const pathname = usePathname();
  const { title, step } = stepHeaderForPath(pathname);

  return (
    // fullWidth so the Stack reaches x=0 — otherwise the iOS edge swipe misses
    // it and pops the whole taste route instead of going back one step. The
    // padding moves to contentStyle so the screens still line up.
    <InnerScreen title={title} fullWidth>
      <View className={"flex-1 gap-4"}>
        <View className={"px-4"}>
          <TasteProgress step={step} />
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
            <Stack.Screen name="genres" />
            <Stack.Screen name="questions/[order]" />
            <Stack.Screen name="preferences" />
          </Stack>
        </View>
      </View>
    </InnerScreen>
  );
}
