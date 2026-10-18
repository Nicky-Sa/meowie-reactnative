import { memo, useState } from "react";
import { TabBarProps } from "react-native-collapsible-tab-view";
import {
  LayoutChangeEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { TabItem } from "@/features/common/tab/tab-item";
import { TabIndicator, TabLayout } from "@/features/common/tab/tab-indicator";
import { SvgImage } from "@/features/common/ui/icon";
import { ScrollHandlerProcessed } from "react-native-reanimated";
import { cn } from "@/lib/tailwind";

export type TabChildProps = {
  scrollHandler: ScrollHandlerProcessed;
};
export type TabConfig = {
  name: string;
  title: string;
  icon?: SvgImage;
};

type Props = Pick<TabBarProps, "index" | "onTabPress"> & {
  tabsConfig: TabConfig[];
  scrollable?: boolean;
  className?: string;
};

export const TabBar = memo(
  ({ tabsConfig, index, onTabPress, scrollable = false, className }: Props) => {
    const { width } = useWindowDimensions();
    const tabWidth = width / tabsConfig.length;
    const [measuredTabs, setMeasuredTabs] = useState<Record<string, TabLayout>>(
      {},
    );
    const tabLayouts = tabsConfig.map((tab, tabIndex) =>
      scrollable
        ? (measuredTabs[tab.name] ?? { x: 0, width: 0 })
        : { x: tabIndex * tabWidth, width: tabWidth },
    );

    const onTabLayout =
      (tabName: string) =>
      ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        setMeasuredTabs((current) =>
          current[tabName]?.x === layout.x &&
          current[tabName]?.width === layout.width
            ? current
            : {
                ...current,
                [tabName]: { x: layout.x, width: layout.width },
              },
        );
      };

    return (
      <View
        className={cn(
          "border-b-2 border-neutral-5-default bg-neutral-15-default",
          className,
        )}
      >
        <ScrollView
          className="h-12 grow-0"
          horizontal
          scrollEnabled={scrollable}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={scrollable ? undefined : "grow"}
        >
          <View
            className={cn("relative flex-row py-3", !scrollable && "flex-1")}
          >
            <TabIndicator index={index} tabLayouts={tabLayouts} />
            {tabsConfig.map((tab, tabIndex) => (
              <TabItem
                key={tab.name}
                name={tab.title}
                icon={tab.icon}
                index={tabIndex}
                currentIndex={index}
                onPress={() => onTabPress(tab.name)}
                className={scrollable ? "flex-none px-4" : undefined}
                onLayout={scrollable ? onTabLayout(tab.name) : undefined}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  },
);

TabBar.displayName = "TabBar";
