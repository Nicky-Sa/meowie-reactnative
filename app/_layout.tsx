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

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
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
          <StatusBar translucent backgroundColor="transparent" style="light" />
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
  );
}
