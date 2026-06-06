import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme } from "expo-router/react-navigation";
import { tailwind } from "@/lib/tailwind";

export const useThemeConfig = () => {
  const colorScheme = useColorScheme();
  return {
    ...(colorScheme.isDarkColorScheme ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme.isDarkColorScheme ? DarkTheme : DefaultTheme).colors,
      background: tailwind.theme.backgroundColor.neutral[15].default,
    },
  };
};
