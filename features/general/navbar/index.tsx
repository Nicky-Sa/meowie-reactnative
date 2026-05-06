import { Tabs } from "expo-router";
import { tailwind } from "@/lib/tailwind";
import { useWindowDimensions, View, Pressable } from "react-native";
import { Icon, SvgImage } from "@/features/common/ui/icon";
import { Tab } from "@/features/general/navbar/types";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

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
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: (props) => (
              <AnimatedTabIcon {...props} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

const AnimatedTabIcon = ({
  focused,
  icon,
}: {
  focused: boolean;
  icon: SvgImage;
}) => {
  const activeColor = tailwind.theme.backgroundColor.neutral[1].default;
  const inactiveColor = tailwind.theme.backgroundColor.neutral[9].default;

  const progress = useDerivedValue(() => {
    return withTiming(focused ? 1 : 0, { duration: 250 });
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [inactiveColor, activeColor],
      ),
    };
  });

  return (
    <View className="mb-1">
      <AnimatedIcon i={icon} animatedProps={animatedProps} />
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

  return (
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
      <SlidingIndicator index={state.index} tabWidth={tabWidth} />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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
            {options.tabBarIcon?.({
              focused: isFocused,
              color: "", // Handled by AnimatedTabIcon internally
              size: 24,
            })}
          </Pressable>
        );
      })}
    </View>
  );
};

const SlidingIndicator = ({
  index,
  tabWidth,
}: {
  index: number;
  tabWidth: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(index * tabWidth, {
          damping: 20,
          stiffness: 150,
          mass: 0.5,
        }),
      },
    ],
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
