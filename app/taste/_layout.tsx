import { Stack } from "expo-router";

export default function TasteLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="step-1" />
      <Stack.Screen
        name="step-2"
        options={{
          gestureEnabled: false, // prevent colliding with the slider
        }}
      />
      <Stack.Screen
        name="finalizing"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
