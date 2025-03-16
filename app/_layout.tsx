import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "@/styles/global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SWRConfig } from "swr";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ title: "Meowie" }} />
            <Stack.Screen
              name="filters/index"
              options={{
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
