import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { Bookmark, Eye } from "iconoir-react-native";
import { List } from "@/features/profile/loading/list";
import { Header } from "@/features/profile/loading/header";
import { TabConfig } from "@/features/common/tab/tab-bar";
import { ProfileTabBar } from "@/features/profile/tab-bar";
import { TabHeader } from "@/features/common/tab/tab-header";
import { TabContent } from "@/features/common/tab/tab-content";
import { SharedValue } from "react-native-reanimated";

const tabsConfig: TabConfig[] = [
  {
    name: "saved",
    title: "Saved",
    icon: Bookmark,
  },
  {
    name: "seen",
    title: "Seen",
    icon: Eye,
  },
];

type Props = {
  scrollY: SharedValue<number>;
};

export const Loading = ({ scrollY }: Props) => {
  return (
    <View className={"flex flex-1 flex-col gap-8"}>
      <TabHeader scrollY={scrollY}>
        <Header />
      </TabHeader>
      <Tabs.Container
        renderTabBar={(props) => (
          <ProfileTabBar tabsConfig={tabsConfig} {...props} />
        )}
      >
        <Tabs.Tab name={tabsConfig[0].name}>
          <TabContent>
            <List />
          </TabContent>
        </Tabs.Tab>

        <Tabs.Tab name={tabsConfig[1].name}>
          <TabContent>
            <List />
          </TabContent>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};
