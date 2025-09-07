import { Tabs } from "expo-router";
import { cn, tailwind } from "@/lib/utils";
import { tabBarContentHeight } from "@/styles/constants";
import { HomeSimple, Search, Bookmark, User } from "iconoir-react-native";
import { View } from "react-native";
import { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({
  children,
  focused,
}: PropsWithChildren<{ focused: boolean }>) => {
  return (
    <View
      className={
        "flex h-full w-full flex-col items-center justify-center gap-1.5"
      }
    >
      {children}
      <View
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          focused && "bg-neutral-1-default",
        )}
      />
    </View>
  );
};

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{
        bottom: 15, // decrease default bottom inset to account for the height and expand clickable area
      }}
      screenOptions={{
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor:
          tailwind.theme.backgroundColor.neutral[1].default,
        tabBarInactiveTintColor:
          tailwind.theme.backgroundColor.neutral[9].default,
        tabBarStyle: {
          backgroundColor: tailwind.theme.backgroundColor.neutral[13].default,
          borderTopColor: tailwind.theme.backgroundColor.neutral[13].default,
          height: bottom + tabBarContentHeight,
        },
      }}
    >
      <Tabs.Screen
        name="movies/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <HomeSimple height={size} width={size} color={color} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Search height={size} width={size} color={color} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist/index"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Bookmark height={size} width={size} color={color} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <User height={size} width={size} color={color} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
