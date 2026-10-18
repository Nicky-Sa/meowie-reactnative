import { TabBarProps } from "react-native-collapsible-tab-view";
import { TabBar } from "@/features/common/tab/tab-bar";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";

export const COLLECTIONS_TAB = "other-collections";

type Props = Pick<TabBarProps, "indexDecimal" | "onTabPress"> & {
  tabs: ExploreTabResDto[];
};

export const ExploreTabBar = ({ tabs, indexDecimal, onTabPress }: Props) => {
  const tabsConfig = [
    ...tabs.map((tab) => ({ name: tab.slug, title: tab.title })),
    { name: COLLECTIONS_TAB, title: "Other collections" },
  ];
  return (
    <TabBar
      tabsConfig={tabsConfig}
      index={indexDecimal}
      onTabPress={onTabPress}
      className="bg-transparent"
      scrollable
    />
  );
};
