import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "@/styles/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PostHogProvider, PostHogSurveyProvider } from "posthog-react-native";
import { InternetCheck } from "@/features/general/internet-check";
import { PortalHost } from "@gorhom/portal";
import { queryClient } from "@/features/common/data/query/client";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ScreenTracker } from "@/features/general/posthog/screen-tracker";
import { posthogStorage } from "@/features/general/posthog/storage";
import { EventListenerWrapper } from "@/features/common/event-emitting/event-listener";
import { TourGuideProvider } from "rn-tourguide";
import { TourTooltip } from "@/features/common/ui/tour/tooltip";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/features/common/ui/toast";
import { env } from "@/lib/env";
import { UpdatesListener } from "@/features/general/updates-listener";

function RootLayout() {
  const themeConfig = useThemeConfig();

  return (
    <View className={"flex-1 bg-neutral-15-default"}>
      <PostHogProvider
        apiKey={env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN}
        options={{
          host: env.EXPO_PUBLIC_POSTHOG_HOST,
          customStorage: posthogStorage,
          captureAppLifecycleEvents: true,
          enableSessionReplay: true,
          errorTracking: {
            autocapture: {
              uncaughtExceptions: true,
              unhandledRejections: true,
            },
          },
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
        <UpdatesListener />
        <PostHogSurveyProvider>
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
                                    animation: "fade",
                                    animationDuration: 300,
                                    presentation: "card",
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
                                  name="settings/feedback"
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
                              <Toast
                                config={toastConfig}
                                topOffset={60}
                                swipeable
                                visibilityTime={4000}
                              />
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
        </PostHogSurveyProvider>
      </PostHogProvider>
    </View>
  );
}

export default RootLayout;
