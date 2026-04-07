import { ThemeProvider } from "@react-navigation/native";
import { Stack, useNavigationContainerRef } from "expo-router";
import "react-native-reanimated";
import "@/styles/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PostHogProvider } from "posthog-react-native";
import { isRunningInExpoGo } from "expo";
import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import { InternetCheck } from "@/features/general/internet-check";
import { PortalHost } from "@gorhom/portal";
import { queryClient } from "@/features/common/data/query/client";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { env } from "@/lib/env";
import { ScreenTracker } from "@/features/general/posthog/screen-tracker";
import { posthogStorage } from "@/features/general/posthog/storage";
import { EventListenerWrapper } from "@/features/common/event-emitting/event-listener";
import { TourGuideProvider } from "rn-tourguide";
import { TourTooltip } from "@/features/common/ui/tour/tooltip";
import { View } from "react-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://a18ee70ea5c101f42678d08d5ec187f2@o4509265002037248.ingest.de.sentry.io/4509265005576272",
  environment: env.EXPO_PUBLIC_APP_VARIANT,
  release: env.EXPO_PUBLIC_SENTRY_RELEASE,
  enableNativeFramesTracking: !isRunningInExpoGo(),

  sendDefaultPii: false,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  tracesSampleRate: env.EXPO_PUBLIC_APP_VARIANT === "development" ? 1.0 : 0.2,
  tracePropagationTargets: [/.*?/],
  // profilesSampleRate is relative to tracesSampleRate.
  profilesSampleRate: 0.1,

  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllImages: true, // Also masking here for performance if an error occurs
      maskAllVectors: true,
    }),
    Sentry.reactNativeTracingIntegration(),
  ],

  spotlight: __DEV__,
});

function RootLayout() {
  const themeConfig = useThemeConfig();

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <View className={"flex-1 bg-neutral-15-default"}>
      <PostHogProvider
        apiKey="phc_cXl1Ma3aVz8gdU0dVlkMFoGhaEjpDZwOWI6p3DP32Jo"
        options={{
          host: "https://eu.i.posthog.com",
          customStorage: posthogStorage,
          captureAppLifecycleEvents: true,
          enableSessionReplay: true,
          sessionReplayConfig: {
            sampleRate: 0.1,
            maskAllTextInputs: true,
            maskAllImages: true, // Reduced CPU by not processing bitmaps
          },
        }}
        autocapture={{
          captureTouches: true,
          captureScreens: true,
        }}
      >
        <ScreenTracker>
          <EventListenerWrapper>
            <ThemeProvider value={themeConfig}>
              <QueryClientProvider client={queryClient}>
                <KeyboardProvider>
                  <SafeAreaProvider>
                    <GestureHandlerRootView>
                      <BottomSheetModalProvider>
                        <InternetCheck>
                          <TourGuideProvider
                            animationDuration={250}
                            tooltipComponent={TourTooltip}
                            backdropColor={"#595BEFAA"}
                            preventOutsideInteraction
                          >
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
                                name="discover/posters"
                                options={{
                                  animation: "slide_from_right",
                                }}
                              />
                              <Stack.Screen
                                name="discover/media-list"
                                options={{
                                  animation: "fade",
                                  animationDuration: 300,
                                }}
                              />
                              <Stack.Screen
                                name="discover/movie-details"
                                options={{
                                  animation: "slide_from_right",
                                }}
                              />
                              <Stack.Screen
                                name="discover/series-details"
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
                                name="person/media-list"
                                options={{
                                  animation: "fade",
                                  animationDuration: 300,
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

                              <Stack.Screen
                                name="library/media-list"
                                options={{
                                  animation: "fade",
                                  animationDuration: 300,
                                }}
                              />

                              <Stack.Screen
                                name="discover/sub-collections"
                                options={{
                                  animation: "slide_from_right",
                                }}
                              />

                              <Stack.Screen name="+not-found" />
                            </Stack>
                            <PortalHost name="global-overlay" />
                          </TourGuideProvider>
                        </InternetCheck>
                      </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                  </SafeAreaProvider>
                </KeyboardProvider>
              </QueryClientProvider>
            </ThemeProvider>
          </EventListenerWrapper>
        </ScreenTracker>
      </PostHogProvider>
    </View>
  );
}

export default Sentry.wrap(RootLayout);
