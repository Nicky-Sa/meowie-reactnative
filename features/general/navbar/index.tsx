import { Tabs } from "expo-router";
import { cn, tailwind } from "@/lib/tailwind";
import { Pressable, PressableProps, View } from "react-native";
import { PropsWithChildren } from "react";
import { Icon } from "@/features/common/ui/icon";
import { Tab } from "@/features/general/navbar/types";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

type Props = {
  tabs: Tab[];
};

export const Navbar = ({ tabs }: Props) => {
  const { capture } = useCaptureEvent();

  const onTabPress = (tabName: string) => {
    capture("navigation_clicked", { destination: tabName });
  };

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
          bottom: Number(tailwind.theme.spacing[6]),
          left: 0,
          right: 0,
          marginHorizontal: "20%",
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
      {tabs.map((tab) => (
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
            tabBarButton: ({ onPress, ...props }: PressableProps) => {
              return (
                <Pressable
                  onPress={(event) => {
                    onTabPress(tab.name);
                    onPress?.(event);
                  }}
                  {...props}
                />
              );
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
