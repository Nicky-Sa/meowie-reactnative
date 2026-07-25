import { Stack, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

// The journey and the reveal are separate routes because they wear different
// shells: (journey) has the shared header + progress bar, result has neither.
// The reveal is terminal — the only ways out are its own actions, so both the
// iOS swipe and the Android back button are blocked while it's up. Going back
// would land on preferences with the save in flight and let it fire twice.
export default function TasteLayout() {
  const pathname = usePathname();
  const rootNavigation = useNavigation("/");
  const revealShown = pathname === "/taste/result";

  useEffect(() => {
    rootNavigation.setOptions({ gestureEnabled: !revealShown });
  }, [rootNavigation, revealShown]);

  useEffect(() => {
    if (!revealShown) return;
    const listener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => listener.remove();
  }, [revealShown]);

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
