import { memo, useRef, useState } from "react";
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
import {
  ScrollHandlerProcessed,
  useAnimatedReaction,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { cn, tailwind } from "@/lib/tailwind";

export type TabChildProps = {
  scrollHandler: ScrollHandlerProcessed;
};
export type TabConfig = {
  name: string;
  title: string;
  icon?: SvgImage;
};

// Matches the px-4 on scrollable tabs, so the indicator covers only the title
const SCROLLABLE_TAB_PADDING = Number(tailwind.theme.spacing["4"]);

type CenteredScrollArgs = {
  tabLayout: TabLayout;
  visibleWidth: number;
  contentWidth: number;
};

const getCenteredScrollX = ({
  tabLayout,
  visibleWidth,
  contentWidth,
}: CenteredScrollArgs) => {
  const centeredX = tabLayout.x + tabLayout.width / 2 - visibleWidth / 2;
  const largestX = Math.max(contentWidth - visibleWidth, 0);
  return Math.min(Math.max(centeredX, 0), largestX);
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
    const indicatorLayouts = tabsConfig.map((tab, tabIndex) => {
      if (!scrollable) {
        return { x: tabIndex * tabWidth + tabWidth / 4, width: tabWidth / 2 };
      }
      const measuredTab = measuredTabs[tab.name];
      if (!measuredTab) return { x: 0, width: 0 };
      return {
        x: measuredTab.x + SCROLLABLE_TAB_PADDING,
        width: measuredTab.width - SCROLLABLE_TAB_PADDING * 2,
      };
    });

    const scrollRef = useRef<ScrollView>(null);
    const [visibleWidth, setVisibleWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);

    const scrollToTab = (tabIndex: number) => {
      const tabLayout = indicatorLayouts[tabIndex];
      if (!tabLayout) return;

      scrollRef.current?.scrollTo({
        x: getCenteredScrollX({ tabLayout, visibleWidth, contentWidth }),
        animated: true,
      });
    };

    useAnimatedReaction(
      () => Math.round(index.value),
      (current, previous) => {
        if (!scrollable || previous === null || current === previous) return;
        scheduleOnRN(scrollToTab, current);
      },
      [scrollable, scrollToTab],
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
          ref={scrollRef}
          onLayout={({ nativeEvent: { layout } }) =>
            setVisibleWidth(layout.width)
          }
          onContentSizeChange={setContentWidth}
          className="h-12 grow-0"
          horizontal
          scrollEnabled={scrollable}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={scrollable ? undefined : "grow"}
        >
          <View
            className={cn("relative flex-row py-3", !scrollable && "flex-1")}
          >
            <TabIndicator index={index} tabLayouts={indicatorLayouts} />
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
