import { View, Text, useWindowDimensions, Pressable } from "react-native";
import { Tabs, TabBarProps } from "react-native-collapsible-tab-view";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Bookmark, Eye } from "iconoir-react-native";
import { Icon, SvgImage } from "@/features/common/ui/icon";
import { BookmarkedList } from "@/features/profile/guest/bookmarked-list";
import { SeenList } from "@/features/profile/guest/seen-list";
import { tailwind } from "@/lib/tailwind";
import { ReactNode, memo } from "react";
import { Header } from "@/features/profile/guest/header";

type TabElement = {
  name: string;
  title: string;
  icon: SvgImage;
  children: () => ReactNode;
};

const tabs: TabElement[] = [
  {
    name: "saved",
    title: "Saved",
    icon: Bookmark,
    children: BookmarkedList,
  },
  {
    name: "seen",
    title: "Seen",
    icon: Eye,
    children: SeenList,
  },
];

const TabIndicator = ({
  index,
  tabWidth,
}: {
  index: TabBarProps["index"];
  tabWidth: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate where the line SHOULD be
    const targetX = index.value * tabWidth;

    return {
      transform: [
        {
          // We wrap targetX in withSpring.
          // Even if index.value jumps instantly from 0 -> 1,
          // withSpring will smoothly animate the transition.
          translateX: withSpring(targetX, {
            damping: 20,
            stiffness: 150,
            mass: 0.5, // Lightweight feel
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-0 left-[13%] z-10 h-[3px] w-1/4 rounded-t-sm bg-neutral-1-default"
    />
  );
};

const TabItem = ({
  name,
  icon,
  index,
  currentIndex,
  onPress,
}: {
  name: string;
  icon: SvgImage;
  index: number;
  currentIndex: TabBarProps["index"];
  onPress: () => void;
}) => {
  const activeColor = tailwind.theme.textColor.neutral[10].default;
  const inactiveColor = tailwind.theme.textColor.neutral[6].default;

  // Use withSpring for Opacity too so the text color doesn't snap instantly
  const activeAnimatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;
    return {
      opacity: withSpring(isActive ? 1 : 0, { mass: 0.5 }),
    };
  });

  const inactiveAnimatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;
    return {
      opacity: withSpring(isActive ? 0 : 1, { mass: 0.5 }),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      className="relative flex-1 items-center justify-center py-3"
    >
      {/* Inactive Layer */}
      <Animated.View
        style={inactiveAnimatedStyle}
        className="flex flex-row items-center justify-center gap-2"
      >
        <Icon i={icon} color={inactiveColor} />
        <Text className="body-b1-strong" style={{ color: inactiveColor }}>
          {name}
        </Text>
      </Animated.View>

      {/* Active Layer (Overlay) */}
      <Animated.View
        style={activeAnimatedStyle}
        className="absolute inset-0 flex flex-row items-center justify-center gap-2"
        pointerEvents="none"
      >
        <Icon i={icon} color={activeColor} />
        <Text className="body-b1-strong" style={{ color: activeColor }}>
          {name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const TabBar = memo(
  ({
    tabs,
    index,
    onTabPress,
  }: TabBarProps & {
    tabs: TabElement[];
  }) => {
    const { width } = useWindowDimensions();
    const tabWidth = width / tabs.length;

    return (
      <View className="relative flex-row bg-neutral-15-default">
        <TabIndicator index={index} tabWidth={tabWidth} />
        {tabs.map((tab, i) => (
          <TabItem
            key={tab.name}
            name={tab.name}
            icon={tab.icon}
            index={i}
            currentIndex={index}
            onPress={() => onTabPress(tab.name)}
          />
        ))}
      </View>
    );
  },
);

TabBar.displayName = "TabBar";

export const Guest = () => {
  return (
    <View className={"flex flex-1 flex-col"}>
      <Header />
      <Tabs.Container
        renderTabBar={(props) => <TabBar tabs={tabs} {...props} />}
      >
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.name} name={tab.name}>
            <Tabs.ScrollView>
              <tab.children />
            </Tabs.ScrollView>
          </Tabs.Tab>
        ))}
      </Tabs.Container>
    </View>
  );
};
