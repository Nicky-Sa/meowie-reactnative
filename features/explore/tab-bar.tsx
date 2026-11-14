import { TabBarProps } from "react-native-collapsible-tab-view";
import { TabBar } from "@/features/common/tab/tab-bar";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";

type Props = Pick<TabBarProps, "indexDecimal" | "onTabPress"> & {
  tabs: ExploreTabResDto[];
};

export const ExploreTabBar = ({ tabs, indexDecimal, onTabPress }: Props) => {
  const tabsConfig = tabs.map((tab) => ({ name: tab.slug, title: tab.title }));
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
