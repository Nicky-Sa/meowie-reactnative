import { Tabs } from "expo-router";
import { cn, tailwind } from "@/lib/utils";
import { View } from "react-native";
import {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { SvgProps } from "react-native-svg";
import { Icon } from "@/features/common/icon";

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
          "h-1 w-3 rounded-full",
          focused && "bg-neutral-1-default",
        )}
      />
    </View>
  );
};

type Props = {
  tabs: {
    name: string;
    title: string;
    icon: ForwardRefExoticComponent<SvgProps & RefAttributes<Svg>>;
  }[];
};

export const Navbar = ({ tabs }: Props) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{
        bottom: 15, // decrease default bottom inset to account for the height and expand clickable area
      }}
      screenOptions={{
        tabBarIconStyle: {
          width: "100%",
          height: "150%",
        },
        headerShown: false,
        tabBarShowLabel: false,
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
          }}
        />
      ))}
    </Tabs>
  );
};
