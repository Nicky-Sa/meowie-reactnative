import { Tabs } from "expo-router";
import { tailwind } from "@/lib/tailwind";
import { useWindowDimensions, View, Pressable, StyleSheet } from "react-native";
import { Icon, SvgImage } from "@/features/common/ui/icon";
import { Tab } from "@/features/general/navbar/types";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { BottomTabBarProps } from "expo-router/js-tabs";
import { createContext, useContext } from "react";
import Animated, {
  DerivedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const INDICATOR_SPRING = {
  damping: 20,
  stiffness: 150,
  mass: 0.5,
};

// Single source of truth for the tab animation: the spring-driven position of
// the sliding indicator. The dot and every icon colour read this on the UI
// thread, so the colour finishes changing exactly when the dot arrives.
const ActiveIndexContext = createContext<DerivedValue<number> | null>(null);

type Props = {
  tabs: Tab[];
};

export const Navbar = ({ tabs }: Props) => {
  const { interaction } = useAnalytics();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 15 }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          onTabPress={(name) =>
            interaction.trackNavigation({ destination: name })
          }
        />
      )}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      {tabs.map((tab, index) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: (props) => (
              <AnimatedTabIcon {...props} icon={tab.icon} index={index} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

const AnimatedTabIcon = ({
  icon,
  index,
}: {
  icon: SvgImage;
  index: number;
}) => {
  const activeColor = tailwind.theme.backgroundColor.neutral[1].default;
  const inactiveColor = tailwind.theme.backgroundColor.neutral[9].default;

  const activeIndex = useContext(ActiveIndexContext);

  // Cross-fade two solid-coloured icons via opacity (a real UI-thread style),
  // so the colour tracks the indicator instead of relying on a JS-thread
  // re-render to repaint the SVG colour.
  const activeStyle = useAnimatedStyle(() => {
    const distance = Math.abs((activeIndex?.value ?? 0) - index);
    return { opacity: 1 - Math.min(distance, 1) };
  });

  return (
    <View className="mb-1">
      <Icon i={icon} color={inactiveColor} />
      <Animated.View
        style={[StyleSheet.absoluteFill, activeStyle]}
        pointerEvents="none"
      >
        <Icon i={icon} color={activeColor} />
      </Animated.View>
    </View>
  );
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  onTabPress,
}: BottomTabBarProps & {
  onTabPress: (name: string) => void;
}) => {
  const { width } = useWindowDimensions();
  const barWidth = width * 0.6;
  const tabWidth = barWidth / state.routes.length - 0.7;

  const activeIndex = useDerivedValue(() =>
    withSpring(state.index, INDICATOR_SPRING),
  );

  return (
    <ActiveIndexContext.Provider value={activeIndex}>
      <View
        className={
          "shadow-neutral-10-default absolute bottom-7 z-10 h-[70px] flex-row items-center rounded-full border-l border-r border-t border-neutral-3-default bg-neutral-14-default shadow-xl"
        }
        style={{
          width: barWidth,
          left: (width - barWidth) / 2,
          elevation: 5,
        }}
      >
        <SlidingIndicator activeIndex={activeIndex} tabWidth={tabWidth} />

        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              onTabPress(route.name);
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="h-full flex-1 items-center justify-center"
            >
              {options?.tabBarIcon?.({
                focused: isFocused,
                color: "", // Handled by AnimatedTabIcon internally
                size: 24,
              })}
            </Pressable>
          );
        })}
      </View>
    </ActiveIndexContext.Provider>
  );
};

const SlidingIndicator = ({
  activeIndex,
  tabWidth,
}: {
  activeIndex: DerivedValue<number>;
  tabWidth: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeIndex.value * tabWidth }],
  }));

  return (
    <Animated.View
      className="absolute bottom-4 left-0 items-center justify-center"
      style={[animatedStyle, { width: tabWidth }]}
    >
      <View className="h-1 w-3 rounded-full bg-neutral-1-default" />
    </Animated.View>
  );
};
