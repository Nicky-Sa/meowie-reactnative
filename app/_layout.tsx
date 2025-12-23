import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useNavigationContainerRef, useSegments } from "expo-router";
import "react-native-reanimated";
import "@/styles/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SWRConfig } from "swr";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PostHogProvider } from "posthog-react-native";
import { isRunningInExpoGo } from "expo";
import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import { InternetCheck } from "@/features/general/internet-check";
import { PortalHost } from "@gorhom/portal";
import { useEventListener } from "@/features/common/event-emitting/useEventListener";
import { Platform } from "react-native";
import { swrConfig } from "@/features/common/data/swr-config";
import {
  KeyboardAvoidingView,
  KeyboardProvider,
} from "react-native-keyboard-controller";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://a18ee70ea5c101f42678d08d5ec187f2@o4509265002037248.ingest.de.sentry.io/4509265005576272",
  environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,
  enableNativeFramesTracking: !isRunningInExpoGo(),

  sendDefaultPii: true,
  replaysSessionSampleRate:
    process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT === "development" ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  tracesSampleRate: process.env.APP_VARIANT === "development" ? 1.0 : 0.5,
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
  const colorScheme = useColorScheme();
  useEventListener();

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  const { bottom } = useSafeAreaInsets();
  const segments = useSegments();
  const isTabsGroup = segments[0] === "(tabs)";
  const isSearchScreen = segments[0] === "search";
  const shouldDisableAvoiding = isTabsGroup || isSearchScreen;

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
      <ThemeProvider
        value={colorScheme.isDarkColorScheme ? DarkTheme : DefaultTheme}
      >
        <SWRConfig value={swrConfig}>
          <KeyboardProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  className={"flex-1"}
                  enabled={!shouldDisableAvoiding}
                  keyboardVerticalOffset={-0.8 * bottom} // keyboardVerticalOffset is set to a negative value to account for the safe area bottom inset
                >
                  <BottomSheetModalProvider>
                    <InternetCheck>
                      <Stack
                        screenOptions={{
                          headerShown: false,
                          statusBarStyle: "light",
                        }}
                      >
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen
                          name="auth/request-otp"
                          options={{
                            animation: "slide_from_right",
                          }}
                        />

                        <Stack.Screen
                          name="auth/verify-otp"
                          options={{
                            animation: "slide_from_right",
                          }}
                        />

                        <Stack.Screen
                          name="filters/index"
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
                          name="deep-dive/index"
                          options={{
                            animation: "slide_from_right",
                          }}
                        />

                        <Stack.Screen
                          name="deep-dive/movies-info"
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
                </KeyboardAvoidingView>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </KeyboardProvider>
        </SWRConfig>
      </ThemeProvider>
    </PostHogProvider>
  );
}

export default Sentry.wrap(RootLayout);
