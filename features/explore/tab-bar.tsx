import { useDerivedValue } from "react-native-reanimated";
import { TabBar } from "@/features/common/tab/tab-bar";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";

export const COLLECTIONS_TAB = "other-collections";

type Props = {
  tabs: ExploreTabResDto[];
  selectedSlug?: string;
  onTabPress: (slug: string) => void;
};

export const ExploreTabBar = ({ tabs, selectedSlug, onTabPress }: Props) => {
  const tabsConfig = [
    ...tabs.map((tab) => ({ name: tab.slug, title: tab.title })),
    { name: COLLECTIONS_TAB, title: "Other collections" },
  ];
  const selectedIndex = Math.max(
    0,
    tabsConfig.findIndex((tab) => tab.name === selectedSlug),
  );
  const tabIndex = useDerivedValue(() => selectedIndex);

  return (
    <TabBar
      tabsConfig={tabsConfig}
      index={tabIndex}
      onTabPress={onTabPress}
      scrollable
    />
  );
};
