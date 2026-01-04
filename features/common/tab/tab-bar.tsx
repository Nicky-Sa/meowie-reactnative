import { memo } from "react";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { useWindowDimensions, View } from "react-native";
import { TabItem } from "@/features/common/tab/tab-item";
import { TabIndicator } from "@/features/common/tab/tab-indicator";
import { SvgImage } from "@/features/common/ui/icon";
import { ScrollHandlerProcessed } from "react-native-reanimated";

export type TabChildProps = {
  scrollHandler: ScrollHandlerProcessed;
};
export type TabConfig = {
  name: string;
  title: string;
  icon: SvgImage;
};

type Props = TabBarProps & {
  tabsConfig: TabConfig[];
};

export const TabBar = memo(({ tabsConfig, index, onTabPress }: Props) => {
  const { width } = useWindowDimensions();
  const tabWidth = width / tabsConfig.length;

  return (
    <View className="relative flex-row border-b-2 border-neutral-5-default bg-neutral-15-default py-3">
      <TabIndicator index={index} tabWidth={tabWidth} />
      {tabsConfig.map((tab, i) => (
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
});

TabBar.displayName = "TabBar";
