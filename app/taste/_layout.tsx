import { Stack, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";

// The taste journey has two halves with different shells, so they're separate
// routes here rather than one stack wearing conditional chrome:
//   (wizard) — the six answering steps, under a shared header + progress bar.
//   result   — the full-screen loading→reveal, with neither.
// The (wizard) group keeps the URLs flat, so the steps stay at /taste,
// /taste/genres, … and the reveal at /taste/result.
//
// The reveal is terminal: it fades in and the back gesture is off, so the only
// ways out are its own "Start watching" / "Share" actions. Android's hardware
// back is blocked on the screen itself.
export default function TasteLayout() {
  const pathname = usePathname();
  const rootNavigation = useNavigation("/");
  const revealShown = pathname === "/taste/result";

  useEffect(() => {
    rootNavigation.setOptions({ gestureEnabled: !revealShown });
  }, [rootNavigation, revealShown]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(wizard)" />
      <Stack.Screen
        name="result"
        options={{ animation: "fade", gestureEnabled: false }}
      />
    </Stack>
  );
}
