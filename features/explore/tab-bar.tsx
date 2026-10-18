import { useDerivedValue } from "react-native-reanimated";
import { TabBar } from "@/features/common/tab/tab-bar";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";

type Props = {
  tabs: ExploreTabResDto[];
  selectedSlug?: string;
  onTabPress: (slug: string) => void;
};

export const ExploreTabBar = ({ tabs, selectedSlug, onTabPress }: Props) => {
  const selectedIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.slug === selectedSlug),
  );
  const tabIndex = useDerivedValue(() => selectedIndex);

  return (
    <TabBar
      tabsConfig={tabs.map((tab) => ({ name: tab.slug, title: tab.title }))}
      index={tabIndex}
      onTabPress={onTabPress}
      scrollable
    />
  );
};
