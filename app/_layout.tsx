import { Stack, ThemeProvider } from "expo-router";
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
import { useThemeConfig } from "@/hooks/use-theme-config";
import { ScreenTracker } from "@/features/general/posthog/screen-tracker";
import { posthog } from "@/features/general/posthog/client";
import { EventListenerWrapper } from "@/features/common/event-emitting/event-listener";
import { SpotlightTourProvider } from "react-native-spotlight-tour";
import { homeTourSteps } from "@/features/common/ui/tour/steps";
import { useSetAtom } from "jotai";
import { homeTourSeenAtom } from "@/atoms";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/features/common/ui/toast";
import { UpdatesListener } from "@/features/general/updates-listener";
import { SiriListener } from "@/features/general/siri-listener";
import { tailwind } from "@/lib/tailwind";

function RootLayout() {
  const themeConfig = useThemeConfig();
  const setHomeTourSeen = useSetAtom(homeTourSeenAtom);

  return (
    <View className={"flex-1 bg-neutral-15-default"}>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureTouches: true,
          captureScreens: true,
        }}
      >
        <UpdatesListener />
        <SiriListener />
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
                            <SpotlightTourProvider
                              steps={homeTourSteps}
                              overlayColor={
                                tailwind.theme.backgroundColor.brand["1"]
                                  .default
                              }
                              overlayOpacity={0.7}
                              motion={"slide"}
                              shape={{ type: "rectangle", padding: 8 }}
                              onBackdropPress={"continue"}
                              onStop={() => setHomeTourSeen(true)}
                              // Match the tooltip background (bg-neutral-15-default)
                              // so the arrow reads as part of the tooltip.
                              arrow={{
                                color:
                                  tailwind.theme.backgroundColor.neutral[15]
                                    .default,
                                size: 12,
                                corner: 3,
                              }}
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

                                <Stack.Screen
                                  name="auth"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />

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
                                  name="movie/[id]/index"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />
                                <Stack.Screen
                                  name="series/[id]/index"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />
                                <Stack.Screen
                                  name="movie/[id]/details"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />
                                <Stack.Screen
                                  name="series/[id]/details"
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
                                  name="release-notes/index"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />

                                <Stack.Screen
                                  name="settings/index"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />

                                <Stack.Screen
                                  name="settings/delete-user"
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
                                  name="person/[id]/index"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />

                                <Stack.Screen
                                  name="person/[id]/media"
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
                                  name="library/[category]"
                                  options={{
                                    animation: "fade",
                                    animationDuration: 300,
                                  }}
                                />

                                <Stack.Screen
                                  name="collection/[id]"
                                  options={{
                                    animation: "slide_from_right",
                                  }}
                                />

                                <Stack.Screen
                                  name="taste"
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
                            </SpotlightTourProvider>
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
