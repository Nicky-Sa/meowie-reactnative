import { ThemeProvider } from "@react-navigation/native";
import { Stack, useNavigationContainerRef } from "expo-router";
import "react-native-reanimated";
import "@/styles/global.css";
import { SWRConfig } from "swr";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PostHogProvider } from "posthog-react-native";
import { isRunningInExpoGo } from "expo";
import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import { InternetCheck } from "@/features/general/internet-check";
import { PortalHost } from "@gorhom/portal";
import { useEventListener } from "@/features/common/event-emitting/useEventListener";
import { swrConfig } from "@/features/common/data/swr-config";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { env } from "@/lib/env";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://a18ee70ea5c101f42678d08d5ec187f2@o4509265002037248.ingest.de.sentry.io/4509265005576272",
  environment: env.EXPO_PUBLIC_APP_VARIANT,
  enableNativeFramesTracking: !isRunningInExpoGo(),

  sendDefaultPii: true,
  replaysSessionSampleRate:
    env.EXPO_PUBLIC_APP_VARIANT === "development" ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  tracesSampleRate: env.EXPO_PUBLIC_APP_VARIANT === "development" ? 1.0 : 0.5,
  tracePropagationTargets: [/.*?/],
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,

  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
    Sentry.reactNativeTracingIntegration(),
  ],

  spotlight: __DEV__,
});

function RootLayout() {
  const themeConfig = useThemeConfig();
  useEventListener();

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <PostHogProvider
      apiKey="phc_cXl1Ma3aVz8gdU0dVlkMFoGhaEjpDZwOWI6p3DP32Jo"
      options={{
        host: "https://eu.i.posthog.com",
        captureAppLifecycleEvents: true,
        enableSessionReplay: true,
        sessionReplayConfig: {
          maskAllTextInputs: false,
          maskAllImages: false,
          maskAllSandboxedViews: false,
        },
      }}
      autocapture={{
        captureTouches: true,
        captureScreens: true,
      }}
    >
      <ThemeProvider value={themeConfig}>
        <SWRConfig value={swrConfig}>
          <KeyboardProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView>
                <BottomSheetModalProvider>
                  <InternetCheck>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        statusBarStyle: "light",
                      }}
                    >
                      <Stack.Screen
                        name="(tabs)"
                        options={{
                          animation: "slide_from_bottom",
                        }}
                      />

                      <Stack.Screen name="auth" />

                      <Stack.Screen
                        name="filters/index"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />

                      <Stack.Screen
                        name="filters/posters-list"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />

                      <Stack.Screen
                        name="filters/movies-list"
                        options={{
                          animation: "fade_from_bottom",
                        }}
                      />

                      <Stack.Screen
                        name="browse/index"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />
                      <Stack.Screen
                        name="browse/movies-list"
                        options={{
                          animation: "fade_from_bottom",
                        }}
                      />
                      <Stack.Screen
                        name="browse/movie-details"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />

                      <Stack.Screen
                        name="onboarding/index"
                        options={{
                          animation: "slide_from_bottom",
                        }}
                      />

                      <Stack.Screen
                        name="settings/index"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />

                      <Stack.Screen
                        name="settings/delete-account"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />

                      <Stack.Screen
                        name="person/index"
                        options={{
                          animation: "slide_from_right",
                        }}
                      />

                      <Stack.Screen
                        name="search/index"
                        options={{
                          animation: "fade",
                          animationDuration: 300,
                          presentation: "card",
                        }}
                      />

                      <Stack.Screen name="+not-found" />
                    </Stack>
                    <PortalHost name="global-overlay" />
                  </InternetCheck>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </KeyboardProvider>
        </SWRConfig>
      </ThemeProvider>
    </PostHogProvider>
  );
}

export default Sentry.wrap(RootLayout);
