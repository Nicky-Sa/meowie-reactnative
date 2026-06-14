import { Stack } from "expo-router";

export default function TasteLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="step-1" />
      <Stack.Screen name="step-2" />
      <Stack.Screen name="finalizing" />
    </Stack>
  );
}
