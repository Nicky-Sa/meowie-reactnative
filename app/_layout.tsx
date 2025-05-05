import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "@/styles/global.css";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SWRConfig } from "swr";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { PostHogProvider } from "posthog-react-native";

Sentry.init({
  dsn: "https://a18ee70ea5c101f42678d08d5ec187f2@o4509265002037248.ingest.de.sentry.io/4509265005576272",
  // enabled: process.env.EXPO_PUBLIC_BUILD_ENV !== "local",
  environment: process.env.EXPO_PUBLIC_BUILD_ENV,
  debug: process.env.EXPO_PUBLIC_BUILD_ENV === "local",
  enableNativeFramesTracking: true,

  // Configure Session Replay
  replaysSessionSampleRate:
    process.env.EXPO_PUBLIC_BUILD_ENV === "local" ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: process.env.EXPO_PUBLIC_BUILD_ENV === "local" ? 1.0 : 0.5,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,

  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
    Sentry.reactNativeTracingIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PostHogProvider
      apiKey="phc_SHWFIM2UDh10qn2gAWM3pQ3hOnrGprRDGceKCJXGlEn"
      options={{
        host: "https://us.i.posthog.com",
      }}
    >
      <ThemeProvider
        value={colorScheme.isDarkColorScheme ? DarkTheme : DefaultTheme}
      >
        <SWRConfig
          value={{
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            shouldRetryOnError: true,
            errorRetryInterval: 3000,
            errorRetryCount: 3,
          }}
        >
          <SafeAreaProvider>
            <StatusBar
              translucent
              backgroundColor="transparent"
              style="light"
            />
            <GestureHandlerRootView className={"flex-1"}>
              <BottomSheetModalProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen
                    name="filters/index"
                    options={{
                      animation: "slide_from_right",
                    }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </SWRConfig>
      </ThemeProvider>
    </PostHogProvider>
  );
});
