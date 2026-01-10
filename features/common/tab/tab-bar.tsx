import { memo } from "react";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { useWindowDimensions, View } from "react-native";
import { TabItem } from "@/features/common/tab/tab-item";
import { TabIndicator } from "@/features/common/tab/tab-indicator";
import { SvgImage } from "@/features/common/ui/icon";
import { ScrollHandlerProcessed } from "react-native-reanimated";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

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

  const { capture } = useCaptureEvent();

  const onTabItemPress = (tabName: string) => {
    capture("profile_tab_changed", { tab_name: tabName });
    onTabPress(tabName);
  };

  return (
    <View className="relative flex-row border-b-2 border-neutral-5-default bg-neutral-15-default py-3">
      <TabIndicator index={index} tabWidth={tabWidth} />
      {tabsConfig.map((tab, i) => (
        <TabItem
          key={tab.name}
          name={tab.title}
          icon={tab.icon}
          index={i}
          currentIndex={index}
          onPress={() => onTabItemPress(tab.name)}
        />
      ))}
    </View>
  );
});

TabBar.displayName = "TabBar";
