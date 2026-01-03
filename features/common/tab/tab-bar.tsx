import { memo, ReactNode } from "react";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { useWindowDimensions, View } from "react-native";
import { TabItem } from "@/features/common/tab/tab-item";
import { TabIndicator } from "@/features/common/tab/tab-indicator";
import { SvgImage } from "@/features/common/ui/icon";

export type TabElement = {
  name: string;
  title: string;
  icon: SvgImage;
  children: () => ReactNode;
};

type Props = TabBarProps & {
  tabs: TabElement[];
};

export const TabBar = memo(({ tabs, index, onTabPress }: Props) => {
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
});

TabBar.displayName = "TabBar";
