import { Tabs } from "expo-router";
import { cn, tailwind } from "@/lib/utils";
import { Pressable, PressableProps, View } from "react-native";
import { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/features/common/icon";
import { Tab } from "@/features/general/navbar/types";

type Props = {
  tabs: Tab[];
};

export const Navbar = ({ tabs }: Props) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 15 }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: { width: "100%", height: "150%" },
        tabBarActiveTintColor:
          tailwind.theme.backgroundColor.neutral[1].default,
        tabBarInactiveTintColor:
          tailwind.theme.backgroundColor.neutral[9].default,
        tabBarStyle: {
          position: "absolute",
          bottom,
          marginHorizontal: Number(tailwind.theme.spacing[4]),
          borderRadius: Number(tailwind.theme.borderRadius.full),
          backgroundColor: tailwind.theme.backgroundColor.neutral[14].default,
          borderTopWidth: 1,
          borderTopColor: tailwind.theme.borderColor.neutral[3].default,
          shadowColor: tailwind.theme.backgroundColor.neutral[10].default,
          shadowOpacity: 0.2,
          shadowRadius: Number(tailwind.theme.borderRadius.xl),
          elevation: 5,
          zIndex: 10,
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused}>
                <Icon i={tab.icon} height={size} width={size} color={color} />
              </TabIcon>
            ),
            tabBarButton: (props: PressableProps) => {
              return <Pressable {...props} />;
            },
          }}
        />
      ))}
    </Tabs>
  );
};

const TabIcon = ({
  children,
  focused,
}: PropsWithChildren<{ focused: boolean }>) => {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-1.5">
      {children}
      <View
        className={cn(
          "h-1 w-3 rounded-full",
          focused && "bg-neutral-1-default",
        )}
      />
    </View>
  );
};
