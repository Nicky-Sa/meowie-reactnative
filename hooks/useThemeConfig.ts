import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
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
