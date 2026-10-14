import { Stack, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

// Back stays blocked during saving to avoid sending the same answers twice.
export default function TasteLayout() {
  const pathname = usePathname();
  const rootNavigation = useNavigation("/");
  const isSavingTaste = pathname === "/taste/result";

  useEffect(() => {
    rootNavigation.setOptions({ gestureEnabled: !isSavingTaste });
  }, [rootNavigation, isSavingTaste]);

  useEffect(() => {
    if (!isSavingTaste) return;
    const listener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => listener.remove();
  }, [isSavingTaste]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(journey)" />
      <Stack.Screen
        name="result"
        options={{ animation: "fade", gestureEnabled: false }}
      />
    </Stack>
  );
}
